import Dexie from "dexie";

export const db = new Dexie("MiCompraDB");

db.version(1).stores({
	lists: "id, date, completedAt",
	meta: "&key",
});

export async function initializeDatabase() {
	const migration = await db.meta.get("localStorageMigration");

	let storedLists = await db.lists.toArray();

	if (!migration) {
		const savedLocalStorage = localStorage.getItem("micompra-lists");

		if (storedLists.length === 0 && savedLocalStorage) {
			try {
				const parsedLists = JSON.parse(savedLocalStorage);

				if (Array.isArray(parsedLists)) {
					await db.transaction("rw", db.lists, db.meta, async () => {
						if (parsedLists.length > 0) {
							await db.lists.bulkPut(parsedLists);
						}

						await db.meta.put({
							key: "localStorageMigration",
							completedAt: new Date().toISOString(),
						});
					});

					storedLists = await db.lists.toArray();

					localStorage.removeItem("micompra-lists");

					return storedLists;
				}
			} catch (error) {
				console.error("No fue posible migrar los datos:", error);

				throw error;
			}
		}

		await db.meta.put({
			key: "localStorageMigration",
			completedAt: new Date().toISOString(),
		});
	}

	return storedLists;
}

export async function saveListsToDatabase(lists) {
	await db.transaction("rw", db.lists, async () => {
		await db.lists.clear();

		if (lists.length > 0) {
			await db.lists.bulkPut(lists);
		}
	});
}
