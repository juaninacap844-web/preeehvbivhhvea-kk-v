var KEY = "biblioteca_libros";

// Libro de ejemplo
var semilla = [
    {
        id: 1,
        isbn: "9781234567890",
        titulo: "JavaScript Moderno",
        autor: "Juan Torres",
        paginas: 450,
        precio: 29990,
        disponible: true,
        fechaPublicacion: "2024-08-15",
        genero: "Programación",
        editorial: {
            nombre: "TechBooks",
            pais: "Chile"
        }
    }
];

var editandoId = null; 

function cargar() {
    var datos = localStorage.getItem(KEY);
    return JSON.parse(datos);
}

function guardar(libros) {
    localStorage.setItem(KEY, JSON.stringify(libros));
}

function siguienteId(libros) {
    if (libros.length == 0) return 1;
    var ids = [];
    for (var i = 0; i < libros.length; i++) {
        ids.push(libros[i].id);
    }
    return Math.max.apply(null, ids) + 1;
}

function buscarPorId(libros, id) {
    for (var i = 0; i < libros.length; i++) {
        if (libros[i].id == id) return libros[i];
    }
    return null;
}

// tabla de los libros
function renderTabla() {
    var libros = cargar();
    var tbody = document.getElementById("tabla-body");

    if (!libros || libros.length == 0) {
        tbody.innerHTML = "<tr><td colspan='7' class='text-center text-muted'>No hay libros registrados.</td></tr>";
        return;
    }

    var html = "";
    for (var i = 0; i < libros.length; i++) {
        var l = libros[i];
        html += "<tr>";
        html += "<td>" + l.titulo + "</td>";
        html += "<td>" + l.autor + "</td>";
        html += "<td>" + (l.isbn || "—") + "</td>";
        html += "<td>" + (l.genero || "—") + "</td>";
        html += "<td>$" + Number(l.precio).toLocaleString("es-CL") + "</td>";
        html += "<td>" + (l.disponible ? "Sí" : "No") + "</td>";
        html += "<td>";
        html += "<button class='btn btn-sm btn-warning me-1' onclick='editarLibro(" + l.id + ")'>Editar</button>";
        html += "<button class='btn btn-sm btn-danger' onclick='eliminarLibro(" + l.id + ")'>Eliminar</button>";
        html += "</td>";
        html += "</tr>";
    }
    tbody.innerHTML = html;
}


function editarLibro(id) {
    var libros = cargar();
    var libro = buscarPorId(libros, id);
    if (!libro) return;

    document.getElementById("isbn").value = libro.isbn;
    document.getElementById("titulo").value = libro.titulo;
    document.getElementById("autor").value = libro.autor;
    document.getElementById("paginas").value = libro.paginas;
    document.getElementById("precio").value = libro.precio;
    document.getElementById("disponible").value = libro.disponible ? "true" : "false";
    document.getElementById("fecha").value = libro.fechaPublicacion;
    document.getElementById("generos").value = libro.genero;
    document.getElementById("editorialNombre").value = libro.editorial.nombre;
    document.getElementById("editorialPais").value = libro.editorial.pais;

    editandoId = id;
    document.getElementById("btn-guardar").innerText = "Actualizar";

    window.scrollTo(0, 0);
}

function eliminarLibro(id) {
    var libros = cargar();
    var nuevaLista = [];
    for (var i = 0; i < libros.length; i++) {
        if (libros[i].id != id) {
            nuevaLista.push(libros[i]);
        }
    }
    guardar(nuevaLista);
    renderTabla();
}

document.getElementById("form-libro").addEventListener("submit", function(e) {
    e.preventDefault();

    var libros = cargar();
    if (!libros) libros = [];

    var datosForm = {
        isbn:             document.getElementById("isbn").value.trim(),
        titulo:           document.getElementById("titulo").value.trim(),
        autor:            document.getElementById("autor").value.trim(),
        paginas:          parseInt(document.getElementById("paginas").value) || 0,
        precio:           parseInt(document.getElementById("precio").value) || 0,
        disponible:       document.getElementById("disponible").value == "true",
        fechaPublicacion: document.getElementById("fecha").value,
        genero:           document.getElementById("generos").value,
        editorial: {
            nombre: document.getElementById("editorialNombre").value.trim(),
            pais:   document.getElementById("editorialPais").value.trim()
        }
    };

    if (editandoId == null) {

        datosForm.id = siguienteId(libros);
        libros.push(datosForm);
        window.alert("Libro agregado correctamente.");
    } else {

        var libro = buscarPorId(libros, editandoId);
        libro.isbn             = datosForm.isbn;
        libro.titulo           = datosForm.titulo;
        libro.autor            = datosForm.autor;
        libro.paginas          = datosForm.paginas;
        libro.precio           = datosForm.precio;
        libro.disponible       = datosForm.disponible;
        libro.fechaPublicacion = datosForm.fechaPublicacion;
        libro.genero           = datosForm.genero;
        libro.editorial        = datosForm.editorial;

        window.alert("Libro actualizado correctamente.");
        editandoId = null;
        document.getElementById("btn-guardar").innerText = "Guardar";
    }

    guardar(libros);
    this.reset();
    renderTabla();
});

if (!cargar()) guardar(semilla);
renderTabla();