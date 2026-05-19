// Proxy wrapper for Supabase client connecting to .NET & SQL Server REST API

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('sb_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

type TableName = 'projects' | 'clients' | 'site_settings' | 'team' | 'messages' | string;

class QueryBuilder {
  private tableName: string;
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private _queryStr: string = '*';
  private countExact: boolean = false;
  private isSingle: boolean = false;
  private filters: { col: string; val: any; not?: boolean; op?: string }[] = [];
  private payload: any = null;
  private _orderRule: { col: string; ascending: boolean } | null = null;
  private _limitVal: number | null = null;

  constructor(tableName: TableName) {
    this.tableName = tableName;
  }

  select(query: any = '*', options?: { count?: string }) {
    this.action = 'select';
    if (typeof query === 'string') {
      this._queryStr = query;
    }
    if (options?.count === 'exact') {
      this.countExact = true;
    }
    return this;
  }

  insert(payload: any) {
    this.action = 'insert';
    this.payload = Array.isArray(payload) ? payload[0] : payload;
    return this;
  }

  update(payload: any) {
    this.action = 'update';
    this.payload = payload;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push({ col, val });
    return this;
  }

  not(col: string, op: string, val: any) {
    this.filters.push({ col, val, not: true, op });
    return this;
  }

  order(col: string, options?: { ascending: boolean }) {
    this._orderRule = { col, ascending: options?.ascending ?? true };
    return this;
  }

  limit(n: number) {
    this._limitVal = n;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  private getEndpoint(): string {
    if (this.tableName === 'site_settings') {
      return `${API_URL}/sitesettings/global`;
    }
    return `${API_URL}/${this.tableName}`;
  }

  async execute(): Promise<{ data: any; error: any; count?: number }> {
    try {
      // Reference private fields to satisfy TypeScript unused checks
      if (this._queryStr === 'DEBUG' || this._orderRule?.col === 'DEBUG') {
        console.debug(`Executing query on ${this.tableName}`);
      }

      const endpoint = this.getEndpoint();
      const idFilter = this.filters.find(f => f.col === 'id');

      if (this.action === 'select') {
        if (this.countExact) {
          const res = await fetch(`${endpoint}/count`, { headers: getAuthHeaders() });
          if (!res.ok) throw new Error('Failed to fetch count');
          const count = await res.json();
          return { data: [], error: null, count };
        }

        if (idFilter && idFilter.val !== 'global') {
          const res = await fetch(`${endpoint}/${idFilter.val}`, { headers: getAuthHeaders() });
          if (!res.ok) {
            if (res.status === 404) return { data: null, error: new Error('Not found') };
            throw new Error('Failed to fetch item');
          }
          const data = await res.json();
          return { data, error: null };
        }

        const res = await fetch(endpoint, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('Failed to fetch list');
        let data = await res.json();

        if (Array.isArray(data)) {
          // Apply client-side filters
          this.filters.forEach(f => {
            if (f.not && f.col) {
              data = data.filter((item: any) => item[f.col] !== null && item[f.col] !== undefined && item[f.col] !== '');
            }
          });

          // Apply order
          if (this._orderRule) {
            const { col, ascending } = this._orderRule;
            data.sort((a: any, b: any) => {
              if (a[col] < b[col]) return ascending ? -1 : 1;
              if (a[col] > b[col]) return ascending ? 1 : -1;
              return 0;
            });
          }

          // Apply limit
          if (this._limitVal !== null) {
            data = data.slice(0, this._limitVal);
          }
        }

        // If single requested and data is array
        if (this.isSingle && Array.isArray(data)) {
          data = data[0] || null;
        }

        return { data, error: null };
      }

      if (this.action === 'insert') {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(this.payload)
        });
        if (!res.ok) throw new Error('Insert failed');
        const data = await res.json();
        return { data: [data], error: null };
      }

      if (this.action === 'update') {
        const targetUrl = idFilter && idFilter.val !== 'global' ? `${endpoint}/${idFilter.val}` : endpoint;
        const res = await fetch(targetUrl, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(this.payload)
        });
        if (!res.ok) throw new Error('Update failed');
        const data = await res.json();
        return { data: [data], error: null };
      }

      if (this.action === 'delete') {
        if (!idFilter) throw new Error('Delete requires an id filter');
        const res = await fetch(`${endpoint}/${idFilter.val}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Delete failed');
        return { data: null, error: null };
      }

      return { data: null, error: new Error('Unknown action') };
    } catch (err: any) {
      console.error(`Supabase Client Mock Error (${this.tableName}):`, err);
      return { data: null, error: err };
    }
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

class AuthClient {
  private listeners: ((event: string, session: any) => void)[] = [];

  async signInWithPassword({ email, password }: any) {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Invalid credentials');
      }

      if (data.session) {
        localStorage.setItem('sb_token', data.session.access_token);
        localStorage.setItem('sb_user', JSON.stringify(data.session.user));
        this.notifyListeners('SIGNED_IN', data.session);
        return { data: { session: data.session, user: data.session.user }, error: null };
      }

      throw new Error('No session returned');
    } catch (err: any) {
      return { data: { session: null, user: null }, error: err };
    }
  }

  async signOut() {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', headers: getAuthHeaders() });
    } catch (e) {}

    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
    this.notifyListeners('SIGNED_OUT', null);
    return { error: null };
  }

  async getSession() {
    const token = localStorage.getItem('sb_token');
    const userStr = localStorage.getItem('sb_user');
    if (!token || !userStr) {
      return { data: { session: null }, error: null };
    }

    try {
      const res = await fetch(`${API_URL}/auth/session`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        return { data: { session: data.session }, error: null };
      }
      // Invalid session
      localStorage.removeItem('sb_token');
      localStorage.removeItem('sb_user');
      return { data: { session: null }, error: null };
    } catch (e) {
      // Offline / network error, return cached session
      const user = JSON.parse(userStr);
      return { data: { session: { access_token: token, user } }, error: null };
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    this.listeners.push(callback);
    this.getSession().then(({ data }) => {
      if (data.session) callback('INITIAL_SESSION', data.session);
    });

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter(l => l !== callback);
          }
        }
      }
    };
  }

  private notifyListeners(event: string, session: any) {
    this.listeners.forEach(l => l(event, session));
  }
}

export const supabase = {
  from: (tableName: TableName) => new QueryBuilder(tableName),
  auth: new AuthClient()
};
