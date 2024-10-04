$(document).ready(function() {
    const apiUrl = 'https://reqres.in/api/users';

    function loadUsers() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(response) {
                let users = response.data;
                let userTableBody = $('#user-table-body');
                userTableBody.empty();
                users.forEach(user => {
                    userTableBody.append(`
                        <tr id="user-${user.id}">
                            <td>${user.id}</td>
                            <td>${user.first_name} ${user.last_name}</td>
                            <td>${user.email}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-user-btn" data-id="${user.id}">Editar</button>
                                <button class="btn btn-danger btn-sm delete-user-btn" data-id="${user.id}">Eliminar</button>
                            </td>
                        </tr>
                    `);
                });
            }
        });
    }

    function showAlert(message, type) {
        $('#alert-container').html(`
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }

    $('#user-form').submit(function(event) {
        event.preventDefault();
        let userId = $('#user-id').val();
        let userName = $('#user-name').val().split(' ');
        let userEmail = $('#user-email').val();
        let userFirstName = userName[0];
        let userLastName = userName.slice(1).join(' ');

        let userData = {
            first_name: userFirstName,
            last_name: userLastName,
            email: userEmail
        };

        if (userId) {
            $.ajax({
                url: `${apiUrl}/${userId}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(userData),
                success: function(response) {
                    showAlert('Usuario actualizado con éxito!', 'success');
                    $('#userModal').modal('hide');
                    $(`#user-${userId}`).html(`
                        <td>${response.id}</td>
                        <td>${response.first_name} ${response.last_name}</td>
                        <td>${response.email}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-user-btn" data-id="${response.id}">Editar</button>
                            <button class="btn btn-danger btn-sm delete-user-btn" data-id="${response.id}">Eliminar</button>
                        </td>
                    `);
                },
                error: function(error) {
                    showAlert('Error al actualizar el usuario.', 'danger');
                }
            });
        } else {
            $.ajax({
                url: apiUrl,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(userData),
                success: function(response) {
                    showAlert('Usuario agregado con éxito!', 'success');
                    $('#userModal').modal('hide');
                    let user = response;
                    $('#user-table-body').append(`
                        <tr id="user-${user.id}">
                            <td>${user.id}</td>
                            <td>${user.first_name} ${user.last_name}</td>
                            <td>${user.email}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-user-btn" data-id="${user.id}">Editar</button>
                                <button class="btn btn-danger btn-sm delete-user-btn" data-id="${user.id}">Eliminar</button>
                            </td>
                        </tr>
                    `);
                },
                error: function(error) {
                    showAlert('Error al agregar el usuario.', 'danger');
                }
            });
        }
    });

    $(document).on('click', '.edit-user-btn', function() {
        let userId = $(this).data('id');
        $.ajax({
            url: `${apiUrl}/${userId}`,
            method: 'GET',
            success: function(response) {
                let user = response.data;
                $('#user-id').val(user.id);
                $('#user-name').val(`${user.first_name} ${user.last_name}`);
                $('#user-email').val(user.email);
                $('#userModalLabel').text('Editar Usuario');
                $('#userModal').modal('show');
            },
            error: function(error) {
                showAlert('Error al obtener los datos del usuario.', 'danger');
            }
        });
    });

    $(document).on('click', '.delete-user-btn', function() {
        let userId = $(this).data('id');
        if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            $.ajax({
                url: `${apiUrl}/${userId}`,
                method: 'DELETE',
                success: function(response) {
                    showAlert('Usuario eliminado con éxito!', 'success');
                    $(`#user-${userId}`).remove();
                },
                error: function(error) {
                    showAlert('Error al eliminar el usuario.', 'danger');
                }
            });
        }
    });

    loadUsers();
});
