var App = function() {
  var root = div({cls:'foo'}, "hello");
  var body = document.body;
  var ws = new WS();

  ws.addHandler('open', function() {
    window.setConnectionInfo();
    console.log("on connectorino");
  });

  ws.addHandler('file:added', function(f) {
    console.log('file added');
    console.log(f);
    window.addEntry(f);
  });

  window.ws = ws;
  window.getID = ws.getID;

  var menu     = new Menu();
  var header   = new HeaderComponent({menu: menu});
  var footer   = new FooterComponent();
  var alerts   = new Alerts();

  var view = div({id:'view'});
  var content = div({id:'content'}, alerts.render(), div({cls:'container'}, view));

  var dom = div({id: 'app'}, header.render(), content, footer.render());

  // alerts.addError("login", "Failed to login", "Invalid Credentials");
  // alerts.addAlert("login", "No file exists");

  var mockedFile = {
    name: 'Mocked File',
    size: '1231',
    type: 'text/plain',
    state: 'uploading',
    slice: function() { return new Blob(["ddawd"], { type: 'text/plain' }); }
  };

  var router = new Router(view);

  router.add("login", ["login.js", "login_component.js"], function() {
    return LoginComponent;
  });

  router.add("file", [
    "date.js",
    "file_view_component.js"
  ], function() {
    return FileViewComponent;
  });

  router.add("files", [
    "date.js",
    "file_list.js",
    "file_list_component.js"
  ], function() {
    return FileListComponent;
  });

  router.add("", [
    "dashboard_component.js",
    "lib/d3.min.js",
  ], function() {
    return DashboardComponent;
  });

  router.add("direct", [
    "p2p_send.js",
    "p2p_recv.js",
    "p2p.js"
  ], function() {
    return P2PComponent;
  });

  router.add("upload", [
    "progress_event.js",
    "chunk.js",
    "chunk_component.js",
    "upload_file.js",
    "upload_file_preview_component.js",
    "upload_file_component.js",
    "uploader.js",
    "uploader_component.js"
  ], function() {
    return UploaderComponent;
  });

  router.add("upload2", [
    "new/sha.js",
    "new/paste.js",
    "new/xhr.js",
    "new/upload.js",
    "new/file_component.js",
    "new/upload_settings.js",
    "new/upload_settings_component.js",
    "new/upload_component.js",
    "new/upload_handler.js",
    "new/upload_worker.js",
    "new/uploader.js"
  ], function() {
    return UploaderComponent;
  });

  router.add("register", [
    "registration_component.js"
  ], function() {
    return RegistrationComponent;
  });

  router.init();

  body.appendChild(dom);

  return {
    addAlert: alerts.addAlert,
    addError: alerts.addError,
    boot: function() {
      ws.connect();
    },
    root: '/api/v1/'
  };
};

window.app = new App();
window.app.boot();

