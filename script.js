var crafts = [];
var ingredients = [];


$(document).ready(function () {

  //MATERIALIZE INIT
  $('.collapsible').collapsible();

  // SEARCHING ITEMS
  $('#txt-search').keyup(function () {
    var searchField = $(this).val();
    if (searchField.length <= 2) {
      $('#filter-craft').html('');
      return;
    }
    else {
      var regex = new RegExp(searchField, "i");
      var output = '<tbody>';
      $.each(data, function (key, val) {
        if (val.isRecipe === true && val.name.search(regex) != -1) {
          var trText = '<tr id="item-' + val.id + '" onclick="updateItem(' + val.id + ')">';
          if (crafts.includes(val))
            trText = '<tr id="item-' + val.id + '" class="select-craft" onclick="updateItem(' + val.id + ')">';
          output += trText;
          output += '<td class="valign-wrapper"><img class="img-table" src="items/' + val.img + '.png">' + val.name + '</td>';
          output += '<td>Nv. ' + val.level + '</td>';
          output += '</tr>';
        }
      });
      output += '</tbody>'
      $('#filter-craft').html(output);
    }
  });

});

function getIngredients(item, nb) {
  if (!item.isRecipe) {
    if (ingredients.includes(item.id)) {
      ingredients[ingredients.indexOf(item.id) + 1] += nb;
    } else {
      ingredients.push(item.id, nb);
    }
  } else {
    var listIngredients = item.ingredients;
    $.each(listIngredients, function(key, val) {
      if (key % 2 === 0) {
        var newItem = data.find(x=>x.id===val);
        getIngredients(newItem, nb * listIngredients[key + 1]);
      }
    });
  }
}


function updateLists() {
  var listCrafts = $('#list-crafts');
  var listCourses = $('#list-courses');
  var outListCrafts = '';
  var outListCourses = '';
  listCrafts.html('');
  listCourses.html('');
  $.each(crafts, function (key, val) {
    outListCrafts += '<div class="chip"><img src="items/'+val.img+'.png">'+val.name+'<i class="close material-icons" onclick="removeItem('+val.id+')">close</i></div>'
    getIngredients(val, 1);
  });
  $.each(ingredients, function (key,val) {
    if (key % 2 === 0) {
      var ingredient = data.find(x=>x.id === val);
      var formLink = 'https://www.wakfu.com/fr/mmorpg/encyclopedie/armes/' + ingredient.id + "-tronchoneuse"
      outListCourses += '<li class="collection-item"><div><img class="img-courses" src="items/'+ingredient.img+'.png"><a href="'+formLink+'">'+ingredient.name+'</a> x'+ingredients[key + 1]+'</div></li>'
    }
  })
  listCrafts.html(outListCrafts);
  listCourses.html(outListCourses);
}


function updateItem(id) {
  var item = data.find(x=>x.id === id);
  if (crafts.includes(item)) {
    crafts = $.grep(crafts, function(val) {
      return val !== item;
    })
    $('#item-' + id).removeClass('select-craft');
  } else {
    crafts.push(item);
    $('#item-' + id).addClass('select-craft');
  }
  ingredients = [];
  updateLists();
}

function removeItem(id) {
  var item = data.find(x=>x.id === id);
  crafts = $.grep(crafts, function(val) {
    return val !== item;
  });
  $('#item-' + id).removeClass('select-craft');
  ingredients = [];
  updateLists();
}