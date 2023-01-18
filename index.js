const path = window.location.pathname;
// Traer productos de la api
const traerProductos = async () => {
	const response = await fetch("https://fakestoreapi.com/products");
	const data = await response.json();
	return data;
};

const agregarBtnCarrito = (seccion, producto, clasesBoton = []) => {
	const agregarBtn = document.createElement("button");
	agregarBtn.classList.add("btn", "btn-primary", ...clasesBoton);
	agregarBtn.innerHTML = "Agregar al carrito";

	agregarBtn.addEventListener("click", (e) => {
		try {
			agregarAlCarrito(producto);
			e.target.innerHTML = "Agregado correctamente";
			e.target.classList.add("btn-success");
		} catch (error) {
			e.target.innerHTML = "Error";
			e.target.classList.add("btn-danger");
			console.log(error);
		}
	});

	seccion.appendChild(agregarBtn);
};

const mostrarProductos = async () => {
	const productos = await traerProductos();
	const seccionProductos = document.querySelector("#seccionProductos");
	const selectOrdenarProductos = document.querySelector(
		"#selectOrdenarProductos"
	);

	const renderProductos = (productos) => {
		seccionProductos.innerHTML = "";
		productos.map((producto) => {
			const productoCard = document.createElement("div");
			productoCard.classList.add(
				"product-card",
				"mr-2",
				"d-flex",
				"flex-column"
			);

			const productoNombre = document.createElement("p");
			productoNombre.textContent = producto.title;

			const productoImagen = document.createElement("img");
			productoImagen.src = producto.image;

			productoCard.appendChild(productoNombre);
			productoCard.appendChild(productoImagen);
			console.log(producto);
			agregarBtnCarrito(productoCard, producto, ["w-50"]);
			seccionProductos.appendChild(productoCard);
		});
	};

	renderProductos(productos);

	selectOrdenarProductos.addEventListener("change", function () {
		const orden = this.value;
		if (orden === "asc") {
			productos.sort((a, b) => (a.title > b.title ? 1 : -1));
		} else {
			productos.sort((a, b) => (a.title < b.title ? 1 : -1));
		}
		renderProductos(productos);
	});
};

const mostrarProductosDestacados = async () => {
	const productos = await traerProductos();
	const productosDestacados = productos.slice(0, 3);
	const carouselInner = document.querySelector(".carousel-inner");
	productosDestacados.forEach((producto) => {
		const div = document.createElement("div");
		div.classList.add("carousel-item");
		const img = document.createElement("img");
		img.classList.add("carousel-item__img", "d-block", "w-100");
		img.src = producto.image;
		img.alt = producto.title;
		console.log(img);
		div.appendChild(img);
		carouselInner.appendChild(div);
	});
	const firstItem = document.querySelector(".carousel-item");
	firstItem.classList.add("active");
};

const mostrarOfertas = async () => {
	const cardGroup = document.querySelector(".card-group");
	const productos = await traerProductos();
	const productosEnOferta = productos.slice(3, 6);

	productosEnOferta.map((producto) => {
		const item = document.createElement("p");
		item.innerHTML = `${producto.title} | $${producto.price}`;

		const itemImg = document.createElement("img");
		itemImg.src = producto.image;

		const card = document.createElement("div");
		card.classList.add("card");
		card.appendChild(itemImg);
		card.appendChild(item);
		agregarBtnCarrito(card, producto);
		cardGroup.appendChild(card);
	});
};

const agregarAlCarrito = (producto) => {
	let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
	producto.uniqueId = Date.now();
	carrito.push(producto);
	localStorage.setItem("carrito", JSON.stringify(carrito));
};

const eliminarProductoCarrito = (producto) => {
	let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
	let index = carrito.findIndex((p) => p.uniqueId === producto.uniqueId);
	if (index !== -1) {
		carrito.splice(index, 1);
	}
	localStorage.setItem("carrito", JSON.stringify(carrito));
	mostrarCarrito();
};

const mostrarCarrito = () => {
	const carrito = document.querySelector("#carrito");
	const ul = document.createElement("ul");
	const productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
	productosCarrito.map((producto) => {
		const li = document.createElement("li");
		li.innerHTML = producto.title;
		const button = document.createElement("button");
		button.innerHTML = "Eliminar";
		button.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
		button.addEventListener("click", () => eliminarProductoCarrito(producto));

		li.appendChild(button);
		ul.appendChild(li);
	});
	carrito.innerHTML = "";
	carrito.appendChild(ul);
};

if (path === "/index.html") {
	mostrarProductosDestacados();
	mostrarOfertas();
}
if (path === "/productos.html") {
	mostrarProductos();
}
if (path === "/carrito.html") {
	mostrarCarrito();
}

if (path === "/contacto.html") {
	const formContacto = document.querySelector("#formContacto");
	function validarForm(e) {
		e.preventDefault();
		var nombre = document.getElementById("nombre").value;
		var apellido = document.getElementById("apellido").value;
		var correo = document.getElementById("correo").value;
		var mensaje = document.getElementById("mensaje").value;

		if (nombre == "") {
			alert("El nombre es requerido");
			return false;
		} else if (apellido == "") {
			alert("El apellido es requerido");
			return false;
		} else if (correo == "") {
			alert("El correo es requerido");
			return false;
		} else if (mensaje == "") {
			alert("El mensaje es requerido");
			return false;
		}
	}
	formContacto.addEventListener("submit", function (e) {
		e.preventDefault();
		validarForm(e);
	});
}
