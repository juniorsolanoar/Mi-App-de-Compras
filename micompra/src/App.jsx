import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [lists, setLists] = useState(() => {
		try {
			const savedLists = localStorage.getItem("micompra-lists");

			return savedLists ? JSON.parse(savedLists) : [];
		} catch {
			return [];
		}
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedListId, setSelectedListId] = useState(null);

	const [openListMenuId, setOpenListMenuId] = useState(null);
	const [isDetailMenuOpen, setIsDetailMenuOpen] = useState(false);

	const [editingListId, setEditingListId] = useState(null);
	const [editListName, setEditListName] = useState("");
	const [editListDate, setEditListDate] = useState("");

	const [editListBudget, setEditListBudget] = useState("");

	const [listName, setListName] = useState("");
	const [listDate, setListDate] = useState(getTodayDate());

	const [isProductModalOpen, setIsProductModalOpen] = useState(false);

	const [productName, setProductName] = useState("");
	const [productQuantity, setProductQuantity] = useState(1);
	const [productUnit, setProductUnit] = useState("unidad");

	const [productPrice, setProductPrice] = useState("");
	const [productActualPrice, setProductActualPrice] = useState("");
	const [productCategory, setProductCategory] = useState("Otros");

	const [isShoppingMode, setIsShoppingMode] = useState(false);

	const [openProductMenuId, setOpenProductMenuId] = useState(null);
	const [editingProductId, setEditingProductId] = useState(null);

	useEffect(() => {
		localStorage.setItem("micompra-lists", JSON.stringify(lists));
	}, [lists]);

	function openProductModal() {
		setEditingProductId(null);

		setProductName("");
		setProductQuantity(1);
		setProductUnit("unidad");
		setProductPrice("");
		setProductActualPrice("");
		setProductCategory("Otros");

		setIsProductModalOpen(true);
	}

	function closeProductModal() {
		setIsProductModalOpen(false);
		setEditingProductId(null);
	}

	function createProduct(event) {
		event.preventDefault();

		if (!productName.trim()) {
			return;
		}

		const newProduct = {
			id: Date.now(),
			name: productName.trim(),
			quantity: Math.max(Number(productQuantity) || 1, 0.01),
			unit: productUnit,

			price: productPrice ? Number(productPrice) : 0,

			actualPrice:
				productActualPrice !== "" ? Number(productActualPrice) : null,

			category: productCategory,
			purchased: false,
		};

		setLists((currentLists) =>
			currentLists.map((list) => {
				if (list.id !== selectedListId) {
					return list;
				}

				return {
					...list,
					products: [...(list.products || []), newProduct],
				};
			}),
		);

		closeProductModal();
	}

	function openEditProduct(product) {
		setEditingProductId(product.id);

		setProductName(product.name);
		setProductQuantity(product.quantity);
		setProductUnit(product.unit);
		setProductPrice(product.price || "");

		setProductActualPrice(product.actualPrice ?? "");

		setProductCategory(product.category);

		setOpenProductMenuId(null);
		setIsProductModalOpen(true);
	}

	function saveEditedProduct(event) {
		event.preventDefault();

		if (!productName.trim()) {
			return;
		}

		setLists((currentLists) =>
			currentLists.map((list) => {
				if (list.id !== selectedListId) {
					return list;
				}

				return {
					...list,
					products: (list.products || []).map((product) =>
						product.id === editingProductId
							? {
									...product,
									name: productName.trim(),
									quantity: Math.max(
										Number(productQuantity) || 1,
										0.01,
									),
									unit: productUnit,
									price: productPrice
										? Number(productPrice)
										: 0,

									actualPrice:
										productActualPrice !== ""
											? Number(productActualPrice)
											: null,

									category: productCategory,
								}
							: product,
					),
				};
			}),
		);

		setEditingProductId(null);
		closeProductModal();
	}

	function deleteProduct(productId) {
		const confirmed = window.confirm(
			"¿Seguro que deseas eliminar este producto?",
		);

		if (!confirmed) {
			return;
		}

		setLists((currentLists) =>
			currentLists.map((list) => {
				if (list.id !== selectedListId) {
					return list;
				}

				return {
					...list,
					products: (list.products || []).filter(
						(product) => product.id !== productId,
					),
				};
			}),
		);

		setOpenProductMenuId(null);
	}

	function togglePurchased(productId) {
		setLists((currentLists) =>
			currentLists.map((list) => {
				if (list.id !== selectedListId) {
					return list;
				}

				return {
					...list,
					products: (list.products || []).map((product) =>
						product.id === productId
							? {
									...product,
									purchased: !product.purchased,
								}
							: product,
					),
				};
			}),
		);
	}

	function updateActualPrice(productId, value) {
		setLists((currentLists) =>
			currentLists.map((list) => {
				if (list.id !== selectedListId) {
					return list;
				}

				return {
					...list,
					products: (list.products || []).map((product) =>
						product.id === productId
							? {
									...product,
									actualPrice:
										value === ""
											? null
											: Math.max(Number(value) || 0, 0),
								}
							: product,
					),
				};
			}),
		);
	}

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
			budget: null,
			products: [],
		};

		setLists((currentLists) => [newList, ...currentLists]);

		setListName("");
		setListDate(getTodayDate());
		setIsModalOpen(false);
	}

	function openEditList(list) {
		setEditingListId(list.id);
		setEditListName(list.name);
		setEditListDate(list.date);
		setEditListBudget(list.budget ?? "");

		setOpenListMenuId(null);
	}

	function closeEditList() {
		setEditingListId(null);
		setEditListName("");
		setEditListDate("");
		setEditListBudget("");
	}

	function saveEditedList(event) {
		event.preventDefault();

		if (!editListName.trim()) {
			return;
		}

		setLists((currentLists) =>
			currentLists.map((list) =>
				list.id === editingListId
					? {
							...list,
							name: editListName.trim(),
							date: editListDate,
							budget:
								editListBudget !== ""
									? Math.max(Number(editListBudget) || 0, 0)
									: null,
						}
					: list,
			),
		);

		closeEditList();
	}

	function duplicateList(list) {
		const duplicatedList = {
			...list,
			id: Date.now(),
			name: `${list.name} - Copia`,
			date: getTodayDate(),
			products: (list.products || []).map((product, index) => ({
				...product,
				id: Date.now() + index + 1,
				purchased: false,
			})),
		};

		setLists((currentLists) => [duplicatedList, ...currentLists]);

		setOpenListMenuId(null);
	}

	function deleteList(listId) {
		const confirmed = window.confirm(
			"¿Seguro que deseas eliminar esta lista?",
		);

		if (!confirmed) {
			return;
		}

		setLists((currentLists) =>
			currentLists.filter((list) => list.id !== listId),
		);

		setOpenListMenuId(null);

		if (selectedListId === listId) {
			setSelectedListId(null);
		}
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
	const selectedList = lists.find((list) => list.id === selectedListId);

	const selectedProducts = selectedList?.products || [];

	const purchasedCount = selectedProducts.filter(
		(product) => product.purchased,
	).length;

	const estimatedTotal = selectedProducts.reduce(
		(sum, product) => sum + product.quantity * (product.price || 0),
		0,
	);

	const actualTotal = selectedProducts.reduce(
		(sum, product) =>
			sum +
			product.quantity * (product.actualPrice ?? product.price ?? 0),
		0,
	);

	const totalDifference = actualTotal - estimatedTotal;

	const totalAmount = actualTotal;

	const selectedBudget = selectedList?.budget ?? null;

	const budgetRemaining =
		selectedBudget !== null ? selectedBudget - totalAmount : null;

	const isOverBudget =
		selectedBudget !== null && totalAmount > selectedBudget;

	const budgetProgress =
		selectedBudget !== null && selectedBudget > 0
			? Math.min(Math.round((totalAmount / selectedBudget) * 100), 100)
			: 0;

	const today = new Date();

	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth() + 1;

	const currentMonthTotal = lists.reduce((total, list) => {
		if (!list.date) {
			return total;
		}

		const [year, month] = list.date.split("-").map(Number);

		if (year !== currentYear || month !== currentMonth) {
			return total;
		}

		const listTotal = (list.products || []).reduce((sum, product) => {
			const effectivePrice = product.actualPrice ?? product.price ?? 0;

			return sum + (Number(product.quantity) || 0) * effectivePrice;
		}, 0);

		return total + listTotal;
	}, 0);

	const activeListsCount = lists.filter((list) => {
		const products = list.products || [];

		if (products.length === 0) {
			return true;
		}

		return products.some((product) => !product.purchased);
	}).length;

	if (selectedList) {
		return (
			<main className="app">
				<section className="list-detail">
					<header className="detail-header">
						<button
							className="back-button"
							onClick={() => {
								setSelectedListId(null);
								setIsDetailMenuOpen(false);
								setIsShoppingMode(false);
							}}
							aria-label="Volver"
						>
							←
						</button>

						<div className="detail-title">
							<span>{formatDate(selectedList.date)}</span>
							<h1>{selectedList.name}</h1>
						</div>

						<button
							className={`shopping-mode-button ${
								isShoppingMode ? "active" : ""
							}`}
							onClick={() =>
								setIsShoppingMode((current) => !current)
							}
						>
							{isShoppingMode
								? "✓ Modo compra"
								: "🛒 Modo compra"}
						</button>

						<div className="detail-menu-wrapper">
							<button
								className="list-menu-button"
								aria-label="Opciones de lista"
								onClick={() =>
									setIsDetailMenuOpen((current) => !current)
								}
							>
								⋮
							</button>

							{isDetailMenuOpen && (
								<div className="list-menu detail-menu">
									<button
										onClick={() => {
											openEditList(selectedList);
											setIsDetailMenuOpen(false);
										}}
									>
										✏️ Editar lista
									</button>

									<button
										onClick={() => {
											duplicateList(selectedList);
											setIsDetailMenuOpen(false);
										}}
									>
										📋 Duplicar lista
									</button>

									<button
										className="danger-menu-item"
										onClick={() => {
											setIsDetailMenuOpen(false);
											deleteList(selectedList.id);
										}}
									>
										🗑️ Eliminar lista
									</button>
								</div>
							)}
						</div>
					</header>

					<section className="detail-summary">
						<div>
							<span>Productos</span>

							<strong>
								{purchasedCount} / {selectedProducts.length}
							</strong>
						</div>

						<div>
							<span>Estimado</span>

							<strong>{formatCurrency(estimatedTotal)}</strong>
						</div>

						<div>
							<span>Real</span>

							<strong>{formatCurrency(actualTotal)}</strong>
						</div>

						<div
							className={
								totalDifference > 0
									? "difference-status over"
									: totalDifference < 0
										? "difference-status under"
										: "difference-status"
							}
						>
							<span>Diferencia</span>

							<strong>
								{totalDifference > 0 ? "+" : ""}
								{formatCurrency(totalDifference)}
							</strong>
						</div>

						{selectedBudget !== null && (
							<>
								<div>
									<span>Presupuesto</span>

									<strong>
										{formatCurrency(selectedBudget)}
									</strong>
								</div>

								<div
									className={
										isOverBudget
											? "budget-status over-budget"
											: "budget-status"
									}
								>
									<span>
										{isOverBudget
											? "Excedido"
											: "Disponible"}
									</span>

									<strong>
										{formatCurrency(
											Math.abs(budgetRemaining),
										)}
									</strong>
								</div>
							</>
						)}
					</section>

					{selectedBudget !== null && (
						<section className="budget-progress-card">
							<div className="budget-progress-header">
								<span>Uso del presupuesto</span>

								<strong>
									{selectedBudget > 0
										? Math.round(
												(totalAmount / selectedBudget) *
													100,
											)
										: 0}
									%
								</strong>
							</div>

							<div className="budget-progress-track">
								<div
									className={`budget-progress-bar ${
										isOverBudget ? "over-budget" : ""
									}`}
									style={{
										width: `${budgetProgress}%`,
									}}
								/>
							</div>

							<div className="budget-progress-footer">
								<span>
									{formatCurrency(totalAmount)} usados
								</span>

								<span>de {formatCurrency(selectedBudget)}</span>
							</div>
						</section>
					)}

					<section
						className={`products-section ${
							isShoppingMode ? "shopping-mode" : ""
						}`}
					>
						{selectedProducts.length === 0 ? (
							<div className="empty-products">
								<div className="empty-icon">🛍️</div>

								<h2>Tu lista está vacía</h2>

								<p>
									Agrega los productos que necesitas comprar.
								</p>

								<button
									className="primary-button"
									onClick={openProductModal}
								>
									+ Agregar producto
								</button>
							</div>
						) : (
							<>
								<div className="products-header">
									<h2>Productos</h2>

									<button
										className="small-add-button"
										onClick={openProductModal}
									>
										+ Agregar
									</button>
								</div>

								<div className="products-list">
									{selectedProducts.map((product) => {
										const estimatedProductTotal =
											product.quantity *
											(product.price || 0);

										const effectiveUnitPrice =
											product.actualPrice ??
											product.price ??
											0;

										const actualProductTotal =
											product.quantity *
											effectiveUnitPrice;

										return (
											<article
												className={`product-card ${
													product.purchased
														? "purchased"
														: ""
												} ${isShoppingMode ? "shopping-product-card" : ""}`}
												key={product.id}
											>
												<div className="product-main">
													<button
														className={`purchase-check ${
															product.purchased
																? "checked"
																: ""
														} ${isShoppingMode ? "shopping-check" : ""}`}
														onClick={() =>
															togglePurchased(
																product.id,
															)
														}
														aria-label={
															product.purchased
																? "Marcar como pendiente"
																: "Marcar como comprado"
														}
													>
														{product.purchased
															? "✓"
															: ""}
													</button>

													<div className="product-info">
														<span className="product-category">
															{product.category}
														</span>

														<h3>{product.name}</h3>

														<p>
															{product.quantity}{" "}
															{product.unit}
														</p>

														<div className="product-prices">
															<span>
																Est.{" "}
																{formatCurrency(
																	product.price ||
																		0,
																)}
															</span>

															{product.actualPrice !==
																null &&
																product.actualPrice !==
																	undefined && (
																	<span className="actual-price">
																		Real{" "}
																		{formatCurrency(
																			product.actualPrice,
																		)}
																	</span>
																)}
														</div>
														{isShoppingMode && (
															<div className="shopping-price-editor">
																<label
																	htmlFor={`actual-price-${product.id}`}
																>
																	Precio real
																</label>

																<div className="shopping-price-input">
																	<span>
																		₡
																	</span>

																	<input
																		id={`actual-price-${product.id}`}
																		type="number"
																		min="0"
																		step="1"
																		inputMode="numeric"
																		placeholder="0"
																		value={
																			product.actualPrice ??
																			""
																		}
																		onChange={(
																			event,
																		) =>
																			updateActualPrice(
																				product.id,
																				event
																					.target
																					.value,
																			)
																		}
																	/>
																</div>
															</div>
														)}
													</div>

													<div className="product-actions">
														<div className="product-total">
															<span>Total</span>

															<strong>
																{formatCurrency(
																	actualProductTotal,
																)}
															</strong>
														</div>

														<div className="product-menu-wrapper">
															<button
																className="product-menu-button"
																aria-label="Opciones de producto"
																onClick={() =>
																	setOpenProductMenuId(
																		(
																			currentId,
																		) =>
																			currentId ===
																			product.id
																				? null
																				: product.id,
																	)
																}
															>
																⋮
															</button>

															{openProductMenuId ===
																product.id && (
																<div className="product-menu">
																	<button
																		onClick={() =>
																			openEditProduct(
																				product,
																			)
																		}
																	>
																		✏️
																		Editar
																	</button>

																	<button
																		className="danger-menu-item"
																		onClick={() =>
																			deleteProduct(
																				product.id,
																			)
																		}
																	>
																		🗑️
																		Eliminar
																	</button>
																</div>
															)}
														</div>
													</div>
												</div>
											</article>
										);
									})}
								</div>
							</>
						)}
					</section>

					{isProductModalOpen && (
						<div
							className="modal-backdrop"
							onClick={closeProductModal}
						>
							<div
								className="modal"
								onClick={(event) => event.stopPropagation()}
							>
								<div className="modal-header">
									<div>
										<span className="eyebrow">
											NUEVO PRODUCTO
										</span>

										<h2>
											{editingProductId !== null
												? "Editar producto"
												: "Agregar producto"}
										</h2>
									</div>

									<button
										className="modal-close"
										onClick={closeProductModal}
										aria-label="Cerrar"
									>
										×
									</button>
								</div>

								<form
									onSubmit={
										editingProductId !== null
											? saveEditedProduct
											: createProduct
									}
								>
									<div className="form-group">
										<label htmlFor="product-name">
											Nombre
										</label>

										<input
											id="product-name"
											type="text"
											value={productName}
											onChange={(event) =>
												setProductName(
													event.target.value,
												)
											}
											placeholder="Ej. Leche"
											autoFocus
										/>
									</div>

									<div className="product-form-grid">
										<div className="form-group">
											<label htmlFor="product-quantity">
												Cantidad
											</label>

											<input
												id="product-quantity"
												type="number"
												min="0.01"
												step="0.01"
												value={productQuantity}
												onChange={(event) =>
													setProductQuantity(
														event.target.value,
													)
												}
											/>
										</div>

										<div className="form-group">
											<label htmlFor="product-unit">
												Unidad
											</label>

											<select
												id="product-unit"
												value={productUnit}
												onChange={(event) =>
													setProductUnit(
														event.target.value,
													)
												}
											>
												<option value="unidad">
													unidad
												</option>
												<option value="kg">kg</option>
												<option value="g">g</option>
												<option value="L">L</option>
												<option value="ml">ml</option>
												<option value="paquete">
													paquete
												</option>
												<option value="caja">
													caja
												</option>
												<option value="bolsa">
													bolsa
												</option>
												<option value="botella">
													botella
												</option>
												<option value="lata">
													lata
												</option>
											</select>
										</div>
									</div>

									<div className="product-form-grid">
										<div className="form-group">
											<label htmlFor="product-price">
												Precio estimado
											</label>

											<input
												id="product-price"
												type="number"
												min="0"
												step="1"
												value={productPrice}
												onChange={(event) =>
													setProductPrice(
														event.target.value,
													)
												}
												placeholder="Ej. 1150"
											/>

											<span className="form-help">
												Precio que esperas pagar.
											</span>
										</div>

										<div className="form-group">
											<label htmlFor="product-actual-price">
												Precio real
											</label>

											<input
												id="product-actual-price"
												type="number"
												min="0"
												step="1"
												value={productActualPrice}
												onChange={(event) =>
													setProductActualPrice(
														event.target.value,
													)
												}
												placeholder="Ej. 1250"
											/>

											<span className="form-help">
												Precio pagado realmente.
											</span>
										</div>
									</div>

									<div className="form-group">
										<label htmlFor="product-category">
											Categoría
										</label>

										<select
											id="product-category"
											value={productCategory}
											onChange={(event) =>
												setProductCategory(
													event.target.value,
												)
											}
										>
											<option value="Frutas y verduras">
												🥦 Frutas y verduras
											</option>

											<option value="Carnes">
												🥩 Carnes
											</option>

											<option value="Lácteos">
												🥛 Lácteos
											</option>

											<option value="Panadería">
												🍞 Panadería
											</option>

											<option value="Abarrotes">
												🥫 Abarrotes
											</option>

											<option value="Congelados">
												🧊 Congelados
											</option>

											<option value="Bebidas">
												🥤 Bebidas
											</option>

											<option value="Limpieza">
												🧹 Limpieza
											</option>

											<option value="Cuidado personal">
												🧴 Cuidado personal
											</option>

											<option value="Mascotas">
												🐶 Mascotas
											</option>

											<option value="Otros">
												📦 Otros
											</option>
										</select>
									</div>

									<div className="modal-actions">
										<button
											type="button"
											className="secondary-button"
											onClick={closeProductModal}
										>
											Cancelar
										</button>

										<button
											type="submit"
											className="primary-button"
											disabled={!productName.trim()}
										>
											{editingProductId !== null
												? "Guardar cambios"
												: "Agregar producto"}
										</button>
									</div>
								</form>
							</div>
						</div>
					)}
				</section>
				{editingListId !== null && (
					<div className="modal-backdrop" onClick={closeEditList}>
						<div
							className="modal"
							onClick={(event) => event.stopPropagation()}
						>
							<div className="modal-header">
								<div>
									<span className="eyebrow">
										EDITAR LISTA
									</span>

									<h2>Modificar lista</h2>
								</div>

								<button
									className="modal-close"
									onClick={closeEditList}
									aria-label="Cerrar"
								>
									×
								</button>
							</div>

							<form onSubmit={saveEditedList}>
								<div className="form-group">
									<label htmlFor="detail-edit-list-name">
										Nombre
									</label>

									<input
										id="detail-edit-list-name"
										type="text"
										value={editListName}
										onChange={(event) =>
											setEditListName(event.target.value)
										}
										autoFocus
									/>
								</div>

								<div className="form-group">
									<label htmlFor="detail-edit-list-date">
										Fecha
									</label>

									<input
										id="detail-edit-list-date"
										type="date"
										value={editListDate}
										onChange={(event) =>
											setEditListDate(event.target.value)
										}
									/>
								</div>

								<div className="form-group">
									<label htmlFor="detail-edit-list-budget">
										Presupuesto
									</label>

									<input
										id="detail-edit-list-budget"
										type="number"
										min="0"
										step="1"
										placeholder="Ejemplo: 50000"
										value={editListBudget}
										onChange={(event) =>
											setEditListBudget(
												event.target.value,
											)
										}
									/>

									<span className="form-help">
										Déjalo vacío si no quieres usar
										presupuesto.
									</span>
								</div>

								<div className="modal-actions">
									<button
										type="button"
										className="secondary-button"
										onClick={closeEditList}
									>
										Cancelar
									</button>

									<button
										type="submit"
										className="primary-button"
										disabled={!editListName.trim()}
									>
										Guardar cambios
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</main>
		);
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

					<strong>{formatCurrency(currentMonthTotal)}</strong>
				</div>

				<div>
					<span>Listas activas</span>

					<strong>{activeListsCount}</strong>
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
						{lists.map((list) => {
							const products = list.products || [];

							const purchased = products.filter(
								(product) => product.purchased,
							).length;

							const total = products.reduce((sum, product) => {
								const effectivePrice =
									product.actualPrice ?? product.price ?? 0;

								return (
									sum +
									(Number(product.quantity) || 0) *
										effectivePrice
								);
							}, 0);

							const progress =
								products.length > 0
									? Math.round(
											(purchased / products.length) * 100,
										)
									: 0;

							const isCompleted =
								products.length > 0 && progress === 100;

							return (
								<article
									className={`list-card ${
										isCompleted ? "list-card-completed" : ""
									}`}
									key={list.id}
									onClick={() => setSelectedListId(list.id)}
								>
									<div className="list-card-top">
										<div>
											<div className="list-card-meta">
												<span className="list-date">
													{formatDate(list.date)}
												</span>

												{isCompleted && (
													<span className="completed-badge">
														✓ Completada
													</span>
												)}
											</div>

											<h3>{list.name}</h3>
										</div>

										<div className="list-menu-wrapper">
											<button
												className="list-menu-button"
												aria-label="Opciones de lista"
												onClick={(event) => {
													event.stopPropagation();

													setOpenListMenuId(
														(currentId) =>
															currentId ===
															list.id
																? null
																: list.id,
													);
												}}
											>
												⋮
											</button>

											{openListMenuId === list.id && (
												<div
													className="list-menu"
													onClick={(event) =>
														event.stopPropagation()
													}
												>
													<button
														onClick={() =>
															openEditList(list)
														}
													>
														✏️ Editar
													</button>

													<button
														onClick={() =>
															duplicateList(list)
														}
													>
														📋 Duplicar
													</button>

													<button
														className="danger-menu-item"
														onClick={() =>
															deleteList(list.id)
														}
													>
														🗑️ Eliminar
													</button>
												</div>
											)}
										</div>
									</div>

									<div className="list-progress-info">
										<span>
											{purchased} de {products.length}{" "}
											productos
										</span>

										<span>{progress}%</span>
									</div>

									<div className="progress-track">
										<div
											className={`progress-bar ${
												progress === 100
													? "completed"
													: ""
											}`}
											style={{ width: `${progress}%` }}
										/>
									</div>

									<div className="list-card-footer">
										<div>
											<span className="list-total-label">
												Total actual
											</span>

											<strong>
												{formatCurrency(total)}
											</strong>
										</div>

										<span className="list-arrow">›</span>
									</div>
								</article>
							);
						})}
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

			{editingListId !== null && (
				<div className="modal-backdrop" onClick={closeEditList}>
					<div
						className="modal"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="modal-header">
							<div>
								<span className="eyebrow">EDITAR LISTA</span>

								<h2>Modificar lista</h2>
							</div>

							<button
								className="modal-close"
								onClick={closeEditList}
								aria-label="Cerrar"
							>
								×
							</button>
						</div>

						<form onSubmit={saveEditedList}>
							<div className="form-group">
								<label htmlFor="edit-list-name">Nombre</label>

								<input
									id="edit-list-name"
									type="text"
									value={editListName}
									onChange={(event) =>
										setEditListName(event.target.value)
									}
									autoFocus
								/>
							</div>

							<div className="form-group">
								<label htmlFor="edit-list-date">Fecha</label>

								<input
									id="edit-list-date"
									type="date"
									value={editListDate}
									onChange={(event) =>
										setEditListDate(event.target.value)
									}
								/>
							</div>

							<div className="form-group">
								<label htmlFor="edit-list-budget">
									Presupuesto
								</label>

								<input
									id="edit-list-budget"
									type="number"
									min="0"
									step="1"
									placeholder="Ejemplo: 50000"
									value={editListBudget}
									onChange={(event) =>
										setEditListBudget(event.target.value)
									}
								/>

								<span className="form-help">
									Déjalo vacío si no quieres usar presupuesto.
								</span>
							</div>

							<div className="modal-actions">
								<button
									type="button"
									className="secondary-button"
									onClick={closeEditList}
								>
									Cancelar
								</button>

								<button
									type="submit"
									className="primary-button"
									disabled={!editListName.trim()}
								>
									Guardar cambios
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
