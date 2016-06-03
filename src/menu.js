var Menu = function() {
  var items = [];
  var menu = span({cls:'menu'});
  var auth = new Authentication();

  var addLink = function(text, path) {
    var item = span({cls:'item', url: path}, text);

    item.onclick = function(e) {
      window.gotoPage(path);
    };

    items.push(item);
  };

  var addText = function(text) {
    var item = span({cls:'item'}, text);
    items.push(item);
  };

  this.update = function() {
    items = [];

    addLink("All Files", "/files");
    addLink("Upload", "/upload");

    if ( auth.loggedIn() ) {
      addLink("Sign Out", "/logout");
      addText(auth.username());
    } else {
      addLink("Sign In", "/login");
    }
  };

  this.render = function() {
    this.update();
    H.empty(menu);

    for (var i = 0; i < items.length; i++) {
      menu.appendChild(items[i]);
    }

    return menu;
  };
};

