import {
  BLOOD_GROUPS,
  BLOOD_COMPONENTS,
  URGENCY_LEVELS,
  type BloodGroup,
  type BloodComponent,
  type UrgencyLevel,
  type Hospital,
  type BloodCamp,
  type BloodInventory,
  type Donor,
  type BloodRequest,
  demoHospitals,
  demoCamps,
  demoInventory,
  demoDonors,
  demoRequests,
} from './demoData';

export {
  BLOOD_GROUPS,
  BLOOD_COMPONENTS,
  URGENCY_LEVELS,
};

export type {
  BloodGroup,
  BloodComponent,
  UrgencyLevel,
  Hospital,
  BloodCamp,
  BloodInventory,
  Donor,
  BloodRequest,
};

type TableName =
  | 'hospitals'
  | 'blood_camps'
  | 'blood_inventory'
  | 'donors'
  | 'blood_requests';

type Row = Record<string, any>;

const STORAGE_KEY = 'lifeflow-demo-database';

function loadDatabase(): Record<TableName, Row[]> {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  const initial = {
    hospitals: demoHospitals,
    blood_camps: demoCamps,
    blood_inventory: demoInventory,
    donors: demoDonors,
    blood_requests: demoRequests,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));

  return initial;
}

function saveDatabase(db: Record<TableName, Row[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

class Query {
  private table: TableName;
  private filters: ((row: Row) => boolean)[] = [];
  private sortField: string | null = null;
  private ascending = true;
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private payload: Row | Row[] | null = null;

  constructor(table: TableName) {
    this.table = table;
  }

  select(_columns = '*') {
    this.action = 'select';
    return this;
  }

  ilike(field: string, pattern: string) {
    const search = pattern.replace(/%/g, '').toLowerCase();

    this.filters.push((row) =>
      String(row[field] ?? '').toLowerCase().includes(search)
    );

    return this;
  }

  eq(field: string, value: any) {
    this.filters.push((row) => row[field] === value);
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.sortField = field;
    this.ascending = options?.ascending ?? true;
    return this;
  }

  insert(data: Row | Row[]) {
    this.action = 'insert';
    this.payload = data;
    return this;
  }

  update(data: Row) {
    this.action = 'update';
    this.payload = data;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  async execute() {
    const db = loadDatabase();
    let rows = db[this.table];

    if (this.action === 'insert') {
      const items = Array.isArray(this.payload)
        ? this.payload
        : [this.payload];

      const newRows = items.map((item) => ({
        id: item?.id ?? crypto.randomUUID(),
        created_at: item?.created_at ?? new Date().toISOString(),
        ...item,
      }));

      db[this.table].push(...newRows);
      saveDatabase(db);

      return {
        data: newRows,
        error: null,
      };
    }

    if (this.action === 'update') {
      let updated: Row[] = [];

      db[this.table] = db[this.table].map((row) => {
        const matches = this.filters.every((filter) => filter(row));

        if (matches) {
          const newRow = { ...row, ...(this.payload as Row) };
          updated.push(newRow);
          return newRow;
        }

        return row;
      });

      saveDatabase(db);

      return {
        data: updated,
        error: null,
      };
    }

    if (this.action === 'delete') {
      const deleted: Row[] = [];

      db[this.table] = db[this.table].filter((row) => {
        const matches = this.filters.every((filter) => filter(row));

        if (matches) {
          deleted.push(row);
          return false;
        }

        return true;
      });

      saveDatabase(db);

      return {
        data: deleted,
        error: null,
      };
    }

    rows = rows.filter((row) =>
      this.filters.every((filter) => filter(row))
    );

    if (this.sortField) {
      rows.sort((a, b) => {
        const av = a[this.sortField!];
        const bv = b[this.sortField!];

        if (av === bv) return 0;

        const result = av > bv ? 1 : -1;
        return this.ascending ? result : -result;
      });
    }

    return {
      data: rows,
      error: null,
    };
  }

  then(
    resolve: (value: { data: Row[]; error: null }) => void,
    reject?: (reason: any) => void
  ) {
    return this.execute().then(resolve, reject);
  }
}

const db = {
  from(table: TableName) {
    return new Query(table);
  },

channel(_name: string) {
  const channel = {
    on(..._args: any[]) {
      return channel;
    },

    subscribe() {
      return channel;
    },
  };

  return channel;
},

  removeChannel(_channel: any) {
    return Promise.resolve();
  },
};

export { db };