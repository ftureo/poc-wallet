# Club La Nación on Google Wallet

### Este es un gran primer intento de archivo Readme para la creación, actualización y baja de credenciales de Club en Google Wallet. 

Todas las acciones deben comenzar con un get para confirmar si la pass class o el pass object ya existen en el sistema.
En la respuesta, habrá un objeto bajo la propiedad "data" que es el que contiene la información para el template de la clase sobre el cual se crearán los objetos passes de los usuarios.

El link oculto tras el QR que se muestra en el pase puede servir para realizar un tracking de los usuarios que lo escanean o para realizar un deep link a la app de Club La Nación y enviar, por ejemplo, un ```{ validatedCredentialInWallet: true }```.

La diferencia sustancial entre el template de la clase y el objeto del pase es que el template es el que contiene la información que se muestra en el pase, mientras que el objeto es el que contiene la información del usuario que lo tiene en su wallet. Es posible que el template de la clase tenga información que no se muestre en el pase, como por ejemplo, el link oculto tras el QR. *-En revisión y construcción de ejemplos de implementación-*

## Strapi en acción?
Mirando un poco la estructura de cómo se puede actualizar el template de la clase y el objeto del pase, se puede ver que hay un objeto llamado "fields" que contiene un array de objetos con la información de cada campo. Cada uno de estos objetos tiene un atributo "name" que es el que se usa para identificar el campo en el template de la clase. Suponiendo que las actualizaciones programáticas se hagan a través de Strapi, se puede hacer un get a la clase para obtener el template, y luego un put a la clase para actualizar el template entonces quedaría el armado de la card (que podría ser cambiable con el tiempo y en base a las campañas) a través del CMS. 

Cada Object debe tener un ```id```, entonces acá podríamos pensar que ese id coincida con el ```CRMID``` del usuario en la base de datos de Club La Nación. Usar el mail puede ser un poco riesgoso porque puede haber más de un usuario con el mismo mail, pero si se usa el ```CRMID``` se puede hacer un get a la base de datos de Club La Nación para obtener el mail y luego enviar el pase a ese mail o, como la propuesta inicial, usar directamente el ```CRMID``` o el ```DNI``` de usuario como ```id``` del objeto.

Las clases y los objetos ya no pueden ser eliminadas. Si se quiere eliminar una clase, se debe cambiar el estado a "inactive" y si se quiere eliminar un objeto, se debe cambiar el estado a "expired". *-En revisión y construcción de ejemplos de implementación-*

## Referencia a los flujos de Google Wallet
Existen dos tipos de flujos disponibles: API Rest y Definición en el JWT. Es posible visualizar la [documentación oficial en este link](https://developers.google.com/wallet/generic/overview/add-to-google-wallet-flow?hl=es-419#create_full_classes_and_objects_in_the_jwt). 

## Escenarios

cuenta x vincula credencial #x en  cuenta #x@mail.com. Revisar nuestra tabla si ese usuario ya está vinculado (fecha, flag, etc). Si no está: es la primera vez, el flujo sigue.
cuenta x vincula credencial #x en  cuenta #y@gmail.com. Revisar la tabla y debería existir el flag, reviso el hasUser de Wallet. Si es false, puede vincularlo y sino, se le notifica que está vinculado a un usuario existente

