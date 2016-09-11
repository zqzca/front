var UploaderButtonsComponent = function(uploader) {
  var dom = div({cls: 'buttons'});
  var state = 'initial';

  // When the file input changes this is called. This is not called when a user
  // pastes files into the web page.
  var filesChanged = function(evt) {
    var files = evt.target.files;

    for (var i = 0; i < files.length; i++) {
      var file = {
        name: files[i].name,
        blob: files[i]
      };

      uploader.add(file);
    }

    // After we add the files, empty the form so that if the user clicks browse
    // again we don't get their original files.
    fileInput.value = '';
  };

  // The user clicks the start button.
  var clickStart = function() {
    alert('start all clicked');
  };

  // The user clicks the stop button.
  var clickStop = function() {
    alert('stop clicked');
  };

  // The user clicks the pause button.
  var clickPause = function() {
    alert('pause clicked');
  };

  // The user clicks the browse button.
  var clickBrowse = function() {
    fileInput.click();
  };

  // The user clicks the clear button.
  var clickClear = function() {
    alert('clear clicked');
  };

  var fileInput = input(
    {cls: 'upload-input', type: 'file', multiple: 'true', onchange: filesChanged}
  );

  var render = function() {
    H.empty(dom);

    var hidden = div({cls: 'hidden'}, fileInput);

    var start = div({cls:'btn', onclick: clickStart}, 'startAll');
    var browse = div({cls:'btn', onclick: clickBrowse}, 'Browse');
    var clear = div({cls:'btn', onclick: clickClear}, 'Clear');

    dom.appendChild(div(hidden, browse, start, clear));

    return dom;
  };

  var update = function(newState) {
    state = newState;
    render();
  };

  return {
    update: update,
    render: render
  };
};

var UploaderComponent = function() {
  var init = function() {
    var f = {
      name: 'foobar',
      blob: new Blob(["ddawd"], { type: 'text/plain' })
    };

    var f2 = {
      name: 'foobar2',
      blob: new Blob(["ddawdawdadw"], { type: 'text/plain' })
    };

    u.add(f);
    u.add(f2);
    //u.start();
  };

  // View updates when a file was added.
  var fileAdded = function(id, file) {
    var fileNode = new FileComponent(u, file);
    dom.appendChild(fileNode.render());
    fileNodes[id] = fileNode;

    console.log("adding a file");
  };

  // View updates when a file is hashed.
  var fileHashed = function(id, hash) {
    fileNodes[id].setHash();
  };

  var fileStateChange = function(id, payload) {
    fileNodes[id].setState();
  };

  var fileRemoved = function(id, payload) {
    var node = fileNodes[id].remove();
    delete fileNodes[id];
  };

  var fileUploading = function(id) {
    fileNodes[id].setState();
  };

  var chunkCreated = function(id, chunk) {
    fileNodes[id].addChunk(chunk);
  };

  var chunkFinished = function(id, chunk) {
    fileNodes[id].finishChunk(chunk);
  };

  var onmessage = function(id, type, payload) {
    switch(type) {
      case 'file:removed':
        fileRemoved(id, payload);
        break;
      case 'file:added':
        fileAdded(id, payload);
        break;
      case 'file:hashed':
        fileHashed(id, payload);
        break;
      case 'file:state':
        fileStateChange(id, payload);
        break;
      case 'file:uploading':
        fileUploading(id);
        break;
      case 'chunk:created':
        chunkCreated(id, payload);
        break;
      case 'chunk:finished':
        chunkFinished(id, payload);
        break;
      default:
        console.log("default: " + type);
        console.dir(payload);
        break;
    }
  };

  var render = function() {
    return div(buttonsNode.render(), dom, "hello");
  };

  var u = Uploader(onmessage);
  window.uploader = u;
  var dom = div({cls: 'uploads'});
  var fileNodes = {}; // Keep track of file nodes
  var buttonsNode = new UploaderButtonsComponent(u);

  return {
    init: init,
    render: render
  };
};

var ChunkComponent = function(chunk) {
  var dom = div({cls:'chunk'}, 'a chunk');

  var set_progress = function(percent) {

  };

  var render = function() {
    return dom;
  };

  return {
    render: render,
    finish: function() {
      dom.appendChild(div('finished'));
    },
    set_progress: set_progress
  };
};
