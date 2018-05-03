// (c) BaseCase 2016


window.Book = {
    init: function (frame, store) {
        var listHTML = '<ul id="test-list" class="list"></ul><div class="details"></div>';
        var activeIndex = 0;
        var charList = [];
        var detailList = [];
        var detailLoadPromis = [];
        $(frame).html(listHTML);
        store.getCharacters().then(function (list) {
            charList = list;
            updateList();
        });

        // Item Click Action
        $(frame).on('click', '.item', function () {
            activeIndex = $('.item').index(this);
            var id = parseInt($(this).attr('list-id'), 10);
            var details = detailList.find(function (detailItem) {
                return detailItem.id === id;
            });
            if (details) {
                updateDetails(details);
            } else {
                detailLoadPromis.push(store.getCharacterDetails(id));
                Promise.all(detailLoadPromis).then(function (details) {
                    var det = details.pop();
                    detailList.push(det);
                    updateDetails(det);
                });
            }
        });

        // edit Click Action

        $(frame).on('click', '.details .edit', function () {
            $(frame).find('.details .editor').addClass('active');
        });

        // cancel Click Action
        $(frame).on('click', '.details .editor .cancel', function () {
            $(frame).find('.details .editor').removeClass('active');
        });

        // Save Click Action
        $(frame).on('click', '.details .editor .save', function () {
            var character = {
                id: parseInt($('input[name="id"]').val(), 10),
                name: $('input[name="name"]').val(),
                species: $('input[name="species"]').val(),
                description: $('textarea[name="description"]').val(),
                picture: $('input[name="picture"]').val(),
            }
            store.updateCharacter(character).then(function () {
                updateDetails(character);
                charList[activeIndex].name = character.name;
                charList[activeIndex].species = character.species;
                updateList();
                $(frame).find('.details .editor').removeClass('active');
            });
        });

        // Update List HTML
        function updateList() {
            var listHTML = '';
            if (charList && charList.length) {
                charList.sort(sortByName);
                charList.forEach((item) => {
                    listHTML += `<li class="item" list-id="${item.id}">
                        <span class="name">${item.name}</span>
                        <span class="species">${item.species}</span>
                        </li>`;
                });
                $(frame).find('.list').html(listHTML);
            }
        }
        // Update Details HTML
        function updateDetails(details) {
            if (details) {
                var detailsHTML = `
                    <div class="thumb"><img src="${details.picture}" /></div>
                    <div class="char-info"><span class="name">${details.name}</span>
                <span class="species">${details.species}</span></div>
                <div class="description">${details.description}</div>
                <button class="edit">Edit</button>
                <form class="editor">
                <input type="hidden" name="id" value="${details.id}" />
                <input type="hidden" name="picture" value="${details.picture}" />
                    <div class="form-control">
                        <label for="name">Name : </label><input type="text" name="name" id="name" value="${details.name}" />
                    </div>
                    <div class="form-control">    
                        <label for="species">Species : </label><input type="text" name="species" id="species" value="${details.species}" />
                    </div>
                    <div class="form-control">
                        <label for="description">Description : </label><textarea name="description" id="description">${details.description}</textarea>
                    </div>
                    <div class="form-control">
                        <input type="button" class="save" value="Save"/>
                        <input type="button" class="cancel" value="Cancel"/>
                    </div>
                </form>`;

                $(frame).find('.details').html(detailsHTML);
            }

        }

        // To Sort the List
        function sortByName(a, b) {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        }
    }
};