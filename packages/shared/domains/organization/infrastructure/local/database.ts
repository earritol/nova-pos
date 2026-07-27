import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'nova-pos';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDatabase(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('organizations')) {
          const orgStore = db.createObjectStore('organizations', { keyPath: 'id' });
          orgStore.createIndex('by_status', 'status');
          orgStore.createIndex('by_sync_status', '_syncStatus');
        }
        if (!db.objectStoreNames.contains('branches')) {
          const branchStore = db.createObjectStore('branches', { keyPath: 'id' });
          branchStore.createIndex('by_org', 'organizationId');
          branchStore.createIndex('by_org_status', ['organizationId', 'status']);
          branchStore.createIndex('by_sync_status', '_syncStatus');
        }
        if (!db.objectStoreNames.contains('audit_log')) {
          const auditStore = db.createObjectStore('audit_log', { keyPath: 'id' });
          auditStore.createIndex('by_entity', ['entityType', 'entityId']);
          auditStore.createIndex('by_org', 'organizationId');
        }
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
          syncStore.createIndex('by_status', 'status');
          syncStore.createIndex('by_created', 'createdAt');
        }
        if (!db.objectStoreNames.contains('terminals')) {
          const terminalStore = db.createObjectStore('terminals', { keyPath: 'id' });
          terminalStore.createIndex('by_org', 'organizationId');
          terminalStore.createIndex('by_branch', ['organizationId', 'branchId']);
          terminalStore.createIndex('by_sync_status', '_syncStatus');
        }
        if (!db.objectStoreNames.contains('device_registrations')) {
          const deviceStore = db.createObjectStore('device_registrations', { keyPath: 'id' });
          deviceStore.createIndex('by_terminal', 'terminalId');
          deviceStore.createIndex('by_installation_id', 'installationId');
          deviceStore.createIndex('by_sync_status', '_syncStatus');
        }
      },
    });
  }
  return dbPromise;
}
