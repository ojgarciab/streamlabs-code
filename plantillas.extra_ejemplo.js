/* Modificar archivo y renombrar como "plantillas.extra.js" */

plantillas.forEach(elemento => {
    switch(elemento.nombre) {
        case "Oldschool own02 (google)":
            elemento.queryParams.forEach(parámetros => {
                switch (parámetros.clave) {
                    case "key":
                        parámetros.valor = "(configurar)";
                        break;
                }
            });
            break;
    }
});
