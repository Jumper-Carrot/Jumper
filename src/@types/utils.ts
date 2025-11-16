// This is a generic interface for a page of results
export interface Page<T> {
  readonly count: number
  readonly results: T[]
}

// This represents the order of a dataset
export interface Order {
  field: string
  direction: 'asc' | 'desc'
}

export type VersionInfo = {
  version: string
  notes: string
  pub_date: string
  platforms: {
    [key: string]: {
      signature: string
      url: string
    }
  }
}
export interface BackendInfo {
  name: string
  version: string
  commit: string
  buildDate: string
  scimEnabled: boolean
  providers: AuthProvider[]
}

export interface AuthProvider {
  id: 'oidc' | 'email'
  name: string
  authUrl: string
  logoutUrl?: string
}
