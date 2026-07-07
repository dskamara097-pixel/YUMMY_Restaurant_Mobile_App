import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  SnapshotOptions,
  startAfter,
  updateDoc,
  where,
  WithFieldValue,
} from '@firebase/firestore';

import { getFirebaseFirestore } from '@/firebase/firestore';
import { AppError } from '@/utils/AppError';

export type RepositoryCreateInput<TModel extends { id: string }> = Omit<TModel, 'id'> & Partial<Pick<TModel, 'id'>>;

export type SortDirection = 'asc' | 'desc';

export type RepositoryFilter = {
  field: string;
  operator?: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any';
  value: unknown;
};

export type RepositorySort = {
  field: string;
  direction?: SortDirection;
};

export type RepositoryQueryOptions = {
  filters?: RepositoryFilter[];
  sort?: RepositorySort[];
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
  searchText?: string;
  searchFields?: string[];
};

export type RepositoryListResult<TModel> = {
  data: TModel[];
  cursor: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
};

export interface Repository<TModel extends { id: string }> {
  create(data: RepositoryCreateInput<TModel>): Promise<TModel>;
  getById(id: string): Promise<TModel | null>;
  list(options?: RepositoryQueryOptions): Promise<TModel[]>;
  listPage(options?: RepositoryQueryOptions): Promise<RepositoryListResult<TModel>>;
  update(id: string, data: Partial<TModel>): Promise<TModel | null>;
  delete(id: string): Promise<void>;
}

export function createFirestoreConverter<TModel extends { id: string }>(): FirestoreDataConverter<TModel> {
  return {
    toFirestore(model: WithFieldValue<TModel>): DocumentData {
      const { id: _id, ...data } = model as TModel;
      return data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): TModel {
      const data = snapshot.data(options) as Omit<TModel, 'id'>;
      return { id: snapshot.id, ...data } as TModel;
    },
  };
}

function requireFirestore() {
  const db = getFirebaseFirestore();

  if (!db) {
    throw new AppError(
      'firebase/configuration',
      'Firestore is not configured. Add approved Firebase environment values before loading database data.',
    );
  }

  return db;
}

function applyClientSearch<TModel>(items: TModel[], options?: RepositoryQueryOptions) {
  if (!options?.searchText?.trim() || !options.searchFields?.length) {
    return items;
  }

  const needle = options.searchText.trim().toLowerCase();

  return items.filter((item) => options.searchFields?.some((field) => {
    const value = (item as Record<string, unknown>)[field];
    return String(value ?? '').toLowerCase().includes(needle);
  }));
}

export class FirestoreRepository<TModel extends { id: string }> implements Repository<TModel> {
  protected readonly converter = createFirestoreConverter<TModel>();

  constructor(protected readonly collectionName: string) {}

  protected collectionRef() {
    return collection(requireFirestore(), this.collectionName).withConverter(this.converter);
  }

  protected docRef(id: string) {
    return doc(requireFirestore(), this.collectionName, id).withConverter(this.converter);
  }

  protected buildConstraints(options?: RepositoryQueryOptions) {
    const constraints: QueryConstraint[] = [];

    options?.filters?.forEach((filter) => {
      constraints.push(where(filter.field, filter.operator ?? '==', filter.value));
    });

    options?.sort?.forEach((sort) => {
      constraints.push(orderBy(sort.field, sort.direction ?? 'asc'));
    });

    if (options?.cursor) {
      constraints.push(startAfter(options.cursor));
    }

    if (options?.pageSize) {
      constraints.push(limit(options.pageSize));
    }

    return constraints;
  }

  async create(data: RepositoryCreateInput<TModel>): Promise<TModel> {
    const timestamp = new Date().toISOString();
    const nextData = {
      ...data,
      createdAt: (data as { createdAt?: string }).createdAt ?? timestamp,
      updatedAt: (data as { updatedAt?: string }).updatedAt ?? timestamp,
    } as RepositoryCreateInput<TModel>;

    if (nextData.id) {
      await setDoc(this.docRef(nextData.id), nextData as TModel);
      return { ...nextData, id: nextData.id } as TModel;
    }

    const docRef = await addDoc(this.collectionRef(), nextData as WithFieldValue<TModel>);
    return { ...nextData, id: docRef.id } as TModel;
  }

  async getById(id: string): Promise<TModel | null> {
    const snapshot = await getDoc(this.docRef(id));
    return snapshot.exists() ? snapshot.data() : null;
  }

  async list(options?: RepositoryQueryOptions): Promise<TModel[]> {
    const result = await this.listPage(options);
    return result.data;
  }

  async listPage(options?: RepositoryQueryOptions): Promise<RepositoryListResult<TModel>> {
    const constraints = this.buildConstraints(options);
    const snapshot = await getDocs(query(this.collectionRef(), ...constraints));
    const data = applyClientSearch(snapshot.docs.map((item) => item.data()), options);
    const cursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
    const hasMore = Boolean(options?.pageSize && snapshot.docs.length === options.pageSize);

    return { data, cursor, hasMore };
  }

  async update(id: string, data: Partial<TModel>): Promise<TModel | null> {
    await updateDoc(doc(requireFirestore(), this.collectionName, id), {
      ...data,
      updatedAt: new Date().toISOString(),
      serverUpdatedAt: serverTimestamp(),
    } as DocumentData);

    return this.getById(id);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(requireFirestore(), this.collectionName, id));
  }
}

