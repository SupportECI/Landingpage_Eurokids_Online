/* Validaciones de casillas*/
(() => {
    'use strict'
  
    const forms = document.querySelectorAll('.needs-validation')
    const formulario  = document.forms['contact-form']
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyZYxCq7T4BLCQnQxXPryVJmujCOVDIbr8pC5yTKICCVkS5ZPeWoAfBZ-yoaKW7fjLAgQ/exec'
    const botonEnvio = document.querySelector('button[type="submit"]'); // Selecciona el botón de envío
    const campoTelefono = formulario.querySelector('input[name="numeroTelefonico"]'); // Selecciona el campo de teléfono
    const codigoAreaPredeterminado = "+52"; // Aquí almacenas el código de área predeterminado
  
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          if (campoTelefono.value.length < 13) {
            campoTelefono.setCustomValidity("número inválido");
          } else {
            campoTelefono.setCustomValidity(""); // Resetear la validación personalizada si es válida
          }
  
          form.classList.add('was-validated')
  
          if (form.checkValidity()){
            // Cambia el texto y deshabilita el botón para evitar múltiples envíos
            botonEnvio.textContent = "Enviando su información...";
            botonEnvio.disabled = true;
  
            fetch(scriptURL, {method: 'POST', body: new FormData(formulario)})
			  
			  .then(response => {
			  // Empuja un evento al dataLayer antes de mostrar el mensaje
			  window.dataLayer = window.dataLayer || [];
			  window.dataLayer.push({
				event: 'swal2_success_shown',
				formId: 'contact-form'
			  });

			  return Swal.fire({
				position: "center",
				icon: "success",
				title: "¡Gracias!",
				text: "Un asesor te contactará lo antes posible",
				showConfirmButton: false,
				timer: 2500
			  });
			})
				
			  
            /*.then(response => Swal.fire({
              position: "center",
              icon: "success",
              title: "¡Gracias!",
              text: "Un asesor te contactará lo antes posible",
              showConfirmButton: false,
              timer: 2500							
              }))*/
			  
            .then(() => {
              // Limpia el formulario sin recargar la página
              formulario.reset(); // Restablece los campos del formulario
              form.classList.remove('was-validated'); // Elimina las clases de validación
              
              // Restaura el código de área en el campo de teléfono
              campoTelefono.value = codigoAreaPredeterminado;
  
              // Restaura el texto y habilita el botón
              botonEnvio.textContent = "Enviar";
              botonEnvio.disabled = false;
            })
            .catch(error => Swal.fire({
              position: "center",
              icon: "error",
              title: "Hubo un error",
              text: "Favor de contactarnos por WhatsApp",
              showConfirmButton: false,
              timer: 2500
            }))
            .finally(() => {
              // Asegura que el botón sea restaurado incluso en caso de error
              botonEnvio.textContent = "Enviar";
              botonEnvio.disabled = false;
            });
          }
  
        }, false)
    })
  })();