import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [lists, setLists] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [listName, setListName] = useState("");
	const [listDate, setListDate] = useState(getTodayDate());

	function getTodayDate() {
		const today = new Date();

		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");

		return `${year}-${month}-${day}`;
	}

	function openNewListModal() {
		setListName("");
		setListDate(getTodayDate());
		setIsModalOpen(true);
	}

	function closeModal() {
		setIsModalOpen(false);
	}

	function createList(event) {
		event.preventDefault();

		if (!listName.trim()) {
			return;
		}

		const newList = {
			id: Date.now(),
			name: listName.trim(),
			date: listDate,
			purchasedItems: 0,
			totalItems: 0,
			total: 0,
			budget: null,
		};

		setLists((currentLists) => [newList, ...currentLists]);

		setListName("");
		setListDate(getTodayDate());
		setIsModalOpen(false);
	}

	function formatDate(date) {
		return new Intl.DateTimeFormat("es-CR", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}).format(new Date(`${date}T12:00:00`));
	}

	function formatCurrency(value) {
		return new Intl.NumberFormat("es-CR", {
			style: "currency",
			currency: "CRC",
			maximumFractionDigits: 0,
		}).format(value);
	}

	return (
		<main className="app">
			<header className="header">
				<div>
					<span className="eyebrow">LISTAS DE COMPRAS</span>
					<h1>MiCompra</h1>
				</div>

				<button className="icon-button" aria-label="Ajustes">
					⚙️
				</button>
			</header>

			<section className="welcome">
				<p>Buenas 👋</p>
				<h2>¿Qué vamos a comprar?</h2>
			</section>

			<section className="summary">
				<div>
					<span>Este mes</span>
					<strong>{formatCurrency(0)}</strong>
				</div>

				<div>
					<span>Listas activas</span>
					<strong>{lists.length}</strong>
				</div>
			</section>

			<section className="lists-section">
				<div className="section-header">
					<h3>Mis listas</h3>

					{lists.length > 0 && (
						<button
							className="small-add-button"
							onClick={openNewListModal}
						>
							+ Nueva
						</button>
					)}
				</div>

				{lists.length === 0 ? (
					<div className="empty-state">
						<div className="empty-icon">🛒</div>

						<h3>Tu carrito está vacío</h3>

						<p>
							Crea tu primera lista y empieza a organizar tus
							compras.
						</p>

						<button
							className="primary-button"
							onClick={openNewListModal}
						>
							+ Nueva lista
						</button>
					</div>
				) : (
					<div className="lists-grid">
						{lists.map((list) => (
							<article className="list-card" key={list.id}>
								<div className="list-card-top">
									<div>
										<span className="list-date">
											{formatDate(list.date)}
										</span>

										<h3>{list.name}</h3>
									</div>

									<button
										className="list-menu-button"
										aria-label="Opciones de lista"
									>
										⋮
									</button>
								</div>

								<div className="list-progress-info">
									<span>
										{list.purchasedItems} de{" "}
										{list.totalItems} productos
									</span>

									<span>0%</span>
								</div>

								<div className="progress-track">
									<div
										className="progress-bar"
										style={{ width: "0%" }}
									/>
								</div>

								<div className="list-card-footer">
									<div>
										<span className="list-total-label">
											Total actual
										</span>

										<strong>
											{formatCurrency(list.total)}
										</strong>
									</div>

									<span className="list-arrow">›</span>
								</div>
							</article>
						))}
					</div>
				)}
			</section>

			<nav className="bottom-navigation">
				<button className="nav-item active">
					<span>🛒</span>
					Listas
				</button>

				<button className="nav-item">
					<span>🕘</span>
					Historial
				</button>

				<button className="nav-item">
					<span>📊</span>
					Estadísticas
				</button>

				<button className="nav-item">
					<span>⚙️</span>
					Ajustes
				</button>
			</nav>

			{isModalOpen && (
				<div className="modal-backdrop" onClick={closeModal}>
					<div
						className="modal"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="modal-header">
							<div>
								<span className="eyebrow">NUEVA COMPRA</span>
								<h2>Nueva lista</h2>
							</div>

							<button
								className="modal-close"
								onClick={closeModal}
								aria-label="Cerrar"
							>
								×
							</button>
						</div>

						<form onSubmit={createList}>
							<div className="form-group">
								<label htmlFor="list-name">
									Nombre de la lista
								</label>

								<input
									id="list-name"
									type="text"
									value={listName}
									onChange={(event) =>
										setListName(event.target.value)
									}
									placeholder="Ej. Compra semanal"
									autoFocus
								/>
							</div>

							<div className="form-group">
								<label htmlFor="list-date">Fecha</label>

								<input
									id="list-date"
									type="date"
									value={listDate}
									onChange={(event) =>
										setListDate(event.target.value)
									}
								/>

								<small>
									Usamos la fecha actual por defecto, pero
									puedes cambiarla.
								</small>
							</div>

							<div className="modal-actions">
								<button
									type="button"
									className="secondary-button"
									onClick={closeModal}
								>
									Cancelar
								</button>

								<button
									type="submit"
									className="primary-button"
									disabled={!listName.trim()}
								>
									Crear lista
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</main>
	);
}

export default App;
