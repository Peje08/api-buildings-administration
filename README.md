## NodeJS API Template

* SonarQube Ready
* OracleDB Ready [node-oracledb](https://github.com/oracle/node-oracledb/tree/main/examples).

### Folder Structure Convention

```
.
├── jest.config.js
├── package.json
├── package-lock.json
├── README.md
├── setup-env.js
├── sonar-project.properties
└── src
    ├── app.js
    ├── app.test.js
    ├── controllers
    │   └── index.js
    ├── db_config
    │   ├── connect.js
    │   ├── helpers.js
    │   ├── oracledb-wrapper.js
    │   └── test
    │       ├── connect.test.js
    │       ├── helpers.test.js
    │       └── oracledb-wrapper.test.js
    ├── express.js
    ├── express.test.js
    ├── globalConfig.js
    ├── querys
    │   ├── index.js
    │   └── querys.test.js
    ├── routes
    │   ├── index.js
    │   └── routes.test.js
    └── swagger.yaml
```
### Controller Example

```js
const routeCallback = async (req, res) => {
    const { someParam } = req.params
    const query = getQuery();
    const { success, data, message } = await select(query, { id: { type: oracledb.STRING, val: someParam } });
    return (success) ? res.status(200).json(data) : res.status(400).json({message});
};
```
La funcion **select** retornara un objeto con la siguiente estructura:

```js
{
    success: true;
    data: [],
    message: 'string'
}
```

La propiedad **success** (booleano) es la que determinara si la ejecución del query a BD fue de manera correcta, según esta variable se puede validar lógica para retornar del api errores personalizados para cada controlador, en caso de error la propiedad **message** tendrá el mensaje de error de la librería de conexión a oracledb

La propiedad **data** sera el array de elementos retornados de la consulta en caso de que esta haya sido exitosa

Todos los valores a parsear en el query, deben enviarse como un objeto en caso de existir, este objeto sera el 2do parámetro de la función **select** y debe tener la estructura que propone la documentación, el nombre que tiene dentro de la string del query, el tipo de dato y su valor, esto evita problemas de casteo de tipo de datos en el motor de oracle ya que es muy sensible en este punto

Para ejemplos de uso mas extenso ver: [Api Sites WDC](http://tapias.claro.amx:7990/projects/WDC/repos/api-sites-wdc/browse?at=refs%2Fheads%2Fdevelop).

Esta plantilla sera un compendio de buenas practicas asi que cualquier aporte es bienvenido para ir mejorandola en el tiempo :sunglasses: