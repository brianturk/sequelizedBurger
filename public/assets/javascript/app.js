
$(document).ready(function () {

    var buttonParent;
    var id;
    var buttonId;


    $('#burger').focus();


    $('#burgerBuddies').multiselect({
        buttonWidth: 450,
        enableFiltering: true,
        nonSelectedText: 'No Burger Buddy',
    });



    var eatAudio = new Audio('../assets/audio/Eating-SoundBible.com-1470347575.wav');

    $(window).resize(function () {
        if ($(window).width() < 500) {
            $("#addBurger").html('Add&nbsp&nbsp&nbsp<i class="fas fa-hamburger"></i>');
        } else {
            $("#addBurger").html('Add Da Burger&nbsp&nbsp&nbsp<i class="fas fa-hamburger"></i>');
        }
    })



    //Devour button

    function makeDevourButton(element) {
        // <a class="nav-link" href="#" data-toggle="modal" data-target="#devourBurger">Solar ID</a>


        let itemLeft = element.width() - element.position().left - 11;
        let newB = $('<button>');
        newB.attr('data-item', element.attr('data-item'));
        newB.css('position', 'absolute');
        newB.text('DEVOUR');
        newB.attr('type', 'button');
        newB.attr('class', 'btn-info devour');
        newB.attr('id', 'devourBtn-' + element.attr('data-item'));
        newB.data('target', '#devourBurger');
        newB.data('toggle', 'modal');
        newB.css('left', itemLeft + 'px');
        element.append(newB)
    }

    $(document).on('mouseenter', '.notEaten', function () {
        let buttonId = '#devourBtn-' + $(this).attr('data-item');

        if ($(buttonId).length === 0) {
            makeDevourButton($(this));
        }
    })

    $(document).on('mouseleave', '.notEaten', function () {
        $('#devourBtn-' + $(this).attr('data-item')).remove();
    })


    //For touchscreen
    $(document).on("touchstart", '.notEaten', function (e) {
        let buttonId = '#devourBtn-' + $(this).attr('data-item');

        if ($(buttonId).length === 0) {
            makeDevourButton($(this));
        }
    })






    $(document).on("click", "#saveDevour", function (e) {

        e.preventDefault();
        //Get buddies
        var buddies = []
        $('#burgerBuddies option:selected').each(function () {
            buddies.push($(this).val())
        })
        console.log(buddies)

        $('#devourBurger').modal('hide');
        $('#eatAudio').trigger('play')

        buttonParent.attr('class', 'list-group-item eaten')
        $(buttonId).remove();

        buttonParent.fadeOut('slow', function () {

            $('#eatenList').append(buttonParent);
            buttonParent.fadeIn('slow', function () {
                let eatenBurger = {
                    id: id,
                    buddies: buddies
                };

                console.log(eatenBurger);
                // Send the PUT request.
                $.ajax("/API/eatBurger/", {
                    type: "PUT",
                    data: eatenBurger
                }).then(function () {
                    $('#eatAudio').trigger('pause')
                }
                );
            })
        })

    });


    $(document).on('click', '.devour', async function () {
        // $(this).data('clicked', true);
        buttonId = '#devourBtn-' + $(this).attr('data-item');
        id = $(this).data('item');
        buttonParent = $(buttonId).parent();

        $('#burgerNameModal').text($(this).parent().data('name'));

        // Get all the burger buddies
        await loadBurgerBuddies();
        $('#devourBurger').modal('show');

    })


    function loadBurgerBuddies(showModal) {
        return new Promise(async function (resolve, reject) {

            $("#burgerBuddies").empty();
            $("#burgerBuddyList").empty();

            $.ajax("/api/burgerBuddies", {
                type: "GET"
            }).then(data => {

                let newA = '<a class="dropdown-item bbDropdown" href="#">[Add a burger buddy]</a>'
                $("#burgerBuddyList").append(newA)

                data.forEach(value => {
                    var newO = $('<option>')
                    newO.val(value.buddy_name)
                    newO.text(value.buddy_name)
                    // console.log(newA);
                    $("#burgerBuddies").append(newO)


                    let newA = '<a class="dropdown-item bbDropdown" href="#">' + value.buddy_name + '</a>'
                    $("#burgerBuddyList").append(newA)
                })


                $('#burgerBuddies').multiselect('rebuild');

                resolve(true);
            })
        })
    }


    $(document).on('click', '#saveNewBuddy', function () {


        let buddyName = $('#buddyName').val().trim()
        if (buddyName != '') {
            // console.log('hello');
            var newBuddy = {
                buddyName: buddyName
            };

            // Send the POST request.
            $.ajax("/api/addBuddy", {
                type: "POST",
                data: newBuddy
            }).then(async data => {
                await loadBurgerBuddies();
                $('#addABuddy').css('display', 'none');
            });


        } else {
            $('#addABuddy').css('display', 'none');
        }

    })

    $(document).on('click', '#endManageBurgerBuddies', function () {
        $('#mBBModal').modal('hide');
    })





    $(document).on('click', '.bbDropdown', function () {
        var buddyName = $(this).text();
        if (buddyName === '[Add a burger buddy]') {
            $('#addABuddy').css('display', 'inline-block');
            $('#editABuddy').css('display', 'none');
            $("#newBuddyName").val('');
            $("#buddyName").focus();
        } else {
            $("#newBuddyNameInvalid").attr('class','invalid-feedback');
            $("#newBuddyName").val(buddyName);
            $("#newBuddyName").data('original', buddyName);
            $('#addABuddy').css('display', 'none');
            $('#editABuddy').css('display', 'inline-block');
            $("#newBuddyName").focus();
        }

    })


    $(document).on('click', '#saveBuddy', function () {

        if ($("#newBuddyName").data('original') != $("#newBuddyName").val().trim()) {
            var newBuddy = {
                newBuddyName: $("#newBuddyName").val().trim(),
                oldBuddyName: $("#newBuddyName").data('original')
            };
            $.ajax({
                method: "PUT",
                url: "/api/updateBuddy",
                data: newBuddy
            })
                .then(async function () {
                    await loadBurgerBuddies();
                    $('#editABuddy').css('display', 'none');
                })
                .catch(err => {
                    if (err.responseJSON.parent.errno === 1761) {
                        $("#newBuddyNameInvalid").attr('class','invalid-feedback d-block')
                    } 
                });

        } else {
            $('#editABuddy').css('display', 'none');
        }

    })


    $(document).on('click', '#deleteBuddy', function () {

        $('#deleteBuddyName').text($("#newBuddyName").data('original'))
        $('#confirmModal').modal('show');

    })

    $(document).on('click', '#modal-btn-yes', function () {
        var buddy = $("#newBuddyName").data('original')

        let removeBuddy = {
            buddyName: buddy
        };

        // Send the PUT request.
        $.ajax("/api/deleteBuddy/", {
            type: "DELETE",
            data: removeBuddy
        }).then(async data => {
            $('#editABuddy').css('display', 'none');
            await loadBurgerBuddies();
            $('#confirmModal').modal('hide');
        });


    })


    $(document).on('click', '#manageBurgerBuddy', async function () {
        // $(this).data('clicked', true);
        $('#burgerNameModal').text($(this).parent().data('name'));
        $('#addABuddy').css('display', 'none');
        $('#editABuddy').css('display', 'none');

        await loadBurgerBuddies()
        $('#mBBModal').modal('show');
    })



    //end devour button


    //Delete button

    function makeDeleteButton(element) {
        let itemLeft = element.width() - element.position().left - 11;
        let newB = $('<button>');
        newB.attr('data-item', element.attr('data-item'));
        newB.css('position', 'absolute');
        newB.html('<i class="fas fa-trash-alt"></i>');
        newB.attr('type', 'button');
        newB.attr('class', 'btn-danger delete');
        newB.attr('id', 'deleteBtn-' + element.attr('data-item'))
        newB.css('left', itemLeft + 'px');


        let newI = $('<button>');
        newI.attr('data-item', element.attr('data-item'));
        newI.css('position', 'absolute');
        newI.attr('class', 'btn-info burgerInfo');
        newI.attr('type', 'button');
        newI.attr('id', 'infoBtn-' + element.attr('data-item'));
        newI.css('left', itemLeft + 35 + 'px');
        newI.html('<i class="fas fa-info-circle"></i>');

        element.append(newB, newI)

    }

    $(document).on('mouseenter', '.eaten', function () {
        let buttonId = '#deleteBtn-' + $(this).attr('data-item');

        if ($(buttonId).length === 0) {
            makeDeleteButton($(this));
        }
    })

    $(document).on('mouseleave', '.eaten', function () {
        $('#deleteBtn-' + $(this).attr('data-item')).remove();
        $('#infoBtn-' + $(this).attr('data-item')).remove();
    })


    //For touchscreen
    $(document).on("touchstart", '.eaten', function (e) {
        let buttonId = '#deleteBtn-' + $(this).attr('data-item');

        if ($(buttonId).length === 0) {
            makeDeleteButton($(this));
        }
    })


    $(document).on("click", "#deleteYes", function () {

        $('#confirmBurgerDelete').modal('hide');
        buttonParent.fadeOut('slow', function () {

            let removeBurger = {
                id: id
            };

            // Send the PUT request.
            $.ajax("/api/deleteBurger/", {
                type: "DELETE",
                data: removeBurger
            }).then(
                function () {
                    buttonParent.remove();

                }
            );

        })

    });


    $(document).on('click', '.delete', function () {
        // $(this).data('clicked', true);

        buttonId = '#deleteBtn-' + $(this).attr('data-item');
        id = $(this).data('item');
        buttonParent = $(buttonId).parent();

        // console.log(buttonParent.data('name'));
        $('#deleteBurgerName').text(buttonParent.data('name'));

        $('#confirmBurgerDelete').modal('show');
    })


    $(document).on('click', '.burgerInfo', function () {
        // $(this).data('clicked', true);

        var buttonId = '#infoBtn-' + $(this).attr('data-item');
        var buttonParent = $(buttonId).parent();

        // console.log(buttonParent.data('name'));
        $('#devouredBurgerName').text(buttonParent.data('name'));

        
        $.ajax("/api/burgerInfo/" + $(this).attr('data-item'), {
            type: "GET"
        }).then(data => {
            
            $('#iBurgerNameText').val(data.burger_name)
            $('#iDevourdedAtText').val(moment(data.updatedAt).format('MMMM Do YYYY, h:mm:ss a'))

            $.ajax("/api/buddyInfo/" + $(this).attr('data-item'), {
                type: "GET"
            }).then(data => {

                // console.log(data)
                $('#iBuddyList').empty();
                data.forEach(function(value){
                    var newLi = $('<li>');
                    newLi.text(value);
                    newLi.attr('class','list-group-item');
                    $('#iBuddyList').append(newLi)
                })


                $('#burgerInfo').modal('show');
            })
        })
    })



    $("#newBurger").on("submit", function (e) {
        e.preventDefault();
        //do post stuff


        var newBurger = {
            burgerName: $("#burger").val().trim()
        };

        // Send the POST request.
        $.ajax("/api/addBurger", {
            type: "POST",
            data: newBurger
        }).then(
            function () {
                // Reload the page to get the updated list
                location.reload();
            }
        );
    })




});


