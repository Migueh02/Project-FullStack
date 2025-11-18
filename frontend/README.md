paga.jsx -> listas de las tareas
Add/page.jsx -> Formulario para agregar tareas
layaout -> Navbar -> estilos globales

- interface Task {...} ->
- useState<Task[]([])> -> indica que el estado es un arreglo de tareas task[], no un arreglo vacia generico
- axios.get<Task[]>()  -> le dice a Axios: "esta peticion devuelve un array de task"
- t.descripcion        -> Ahora vscode sabe que t es un task, reconoce el titulo, descripciom etc...