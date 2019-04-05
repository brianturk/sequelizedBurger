
$(document).ready(function () {
    $('#burger').focus();
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
        let itemLeft = element.width() - element.position().left - 11;
        let newB = $('<button>');
        newB.attr('data-item', element.attr('data-item'));
        newB.css('position', 'absolute');
        newB.text('DEVOUR');
        newB.attr('type', 'button');
        newB.attr('class', 'btn-info devour');
        newB.attr('id', 'devourBtn-' + element.attr('data-item'))
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


    $(document).on("click", ".notEaten", function () {
        let buttonId = '#devourBtn-' + $(this).attr('data-item');

        if (!$(buttonId).data('clicked') && ($(buttonId).length === 0)) {
            makeDevourButton($(this));
        } else if ($(buttonId).data('clicked')) {
            $('#eatAudio').trigger('play')
            // eatAudio.play();
            let buttonParent = $(buttonId).parent();
            let id = $(this).data('item');
            buttonParent.attr('class', 'list-group-item eaten')
            $(buttonId).remove();
            buttonParent.fadeOut('slow', function () {

                $('#eatenList').append(buttonParent);
                buttonParent.fadeIn('slow', function () {
                    let eatenBurger = {
                        id: id
                    };

                    // Send the PUT request.
                    $.ajax("/API/eatBurger/", {
                        type: "PUT",
                        data: eatenBurger
                    }).then(
                        function () {
                            $('#eatAudio').trigger('pause')
                        }
                    );
                })
            })
        }
    });


    $(document).on('click', '.devour', function () {
        $(this).data('clicked', true);
    })


    //end devour button


    //Delete button

    function makeDeleteButton(element) {
        let itemLeft = element.width() - element.position().left - 11;
        let newB = $('<button>');
        newB.attr('data-item', element.attr('data-item'));
        newB.css('position', 'absolute');
        newB.text('DELETE');
        newB.attr('type', 'button');
        newB.attr('class', 'btn-danger delete');
        newB.attr('id', 'deleteBtn-' + element.attr('data-item'))
        newB.css('left', itemLeft + 'px');
        element.append(newB)
    }

    $(document).on('mouseenter', '.eaten', function () {
        let buttonId = '#deleteBtn-' + $(this).attr('data-item');

        if ($(buttonId).length === 0) {
            makeDeleteButton($(this));
        }
    })

    $(document).on('mouseleave', '.eaten', function () {
        $('#deleteBtn-' + $(this).attr('data-item')).remove();
    })


    //For touchscreen
    $(document).on("touchstart", '.eaten', function (e) {
        let buttonId = '#deleteBtn-' + $(this).attr('data-item');

        if ($(buttonId).length === 0) {
            makeDeleteButton($(this));
        }
    })


    $(document).on("click", ".eaten", function () {
        let buttonId = '#deleteBtn-' + $(this).attr('data-item');

        if (!$(buttonId).data('clicked') && ($(buttonId).length === 0)) {
            makedeleteButton($(this));
        } else if ($(buttonId).data('clicked')) {

            let buttonParent = $(buttonId).parent();
            let id = $(this).data('item');


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
        }
    });


    $(document).on('click', '.delete', function () {
        $(this).data('clicked', true);
    })


    //end delete button




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


