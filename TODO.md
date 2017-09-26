#### TODOS ####
1- Terminar las vistas de los listings y decidir que hacer con la paginacion.
2- Agregar las vista de succes cuando se inserta un problema y no esta habilitado JavaScript.
3- Revisar cuando se hostee la app si sweetalert y animate.css suponen una relentizacion de la pagina.
4- Ver como poner en una misma clase los elementos comunes de card y card-listing en styles.css para ahorrar kb.

Local Admin:
1- Observar si la implementacion de la descarga de pinchas esta bien, sobre todo la parte a la hora de cambiar el flag en la nube de que ya fue descargado hacia la bd local y no sea asi por problemas de conexion. Una forma de solventar esto seria mandando un request hacia la nube con el id del doc para cambiar el flag siempre y cuando el doc ya haya sido guardado en bd.
2- Valorar la posibilidad de cambiar forEach por for debido a que puede ser que el 1ro de bateo con la sync.