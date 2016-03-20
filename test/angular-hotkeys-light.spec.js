describe('$Hotkeys', function() {
  var Hotkeys;

  /**
   * Creates Hotkeys mutable object
   * @param  {Hotkeys} Immutable Immutable Hotkeys object
   * @return {HotkeysMutable}
   */
  var MutableHotkeys = function(Immutable) {
    var Mutable = function() {
      Immutable.call(this);
    };

    Mutable.prototype = Object.create(Immutable.prototype);

    Object.defineProperty(Mutable.prototype, 'keyStringFromEvent', {
      value: function() {
        return Immutable.prototype.keyStringFromEvent.apply(this, arguments);
      }, writable: true
    });

    Object.defineProperty(Mutable.prototype, '_registerKey', {
      value: function() {
        Immutable.prototype._registerKey.apply(this, arguments);
      }, writable: true
    });

    Object.defineProperty(Mutable.prototype, 'createHotkey', {
      value: function() {
        return Immutable.prototype.createHotkey.apply(this, arguments);
      }, writable: true
    });

    return Mutable;
  };

  var createEvent = function(args) {
    var eventName = args.name || 'keydown';
    var evt = new CustomEvent(eventName, {bubbles: true});
    evt.code = args.code;
    evt.which = args.which;
    evt.keyCode = args.which;
    evt.shiftKey = Boolean(args.shiftKey);
    evt.ctrlKey = Boolean(args.ctrlKey);
    evt.altKey = Boolean(args.altKey);
    evt.metaKey = Boolean(args.metaKey);
    return evt;
  };

  var sendKeydown = function(event) {
    window.dispatchEvent(event);
  };

  var invokeHotkey = function(args) {
    var hotkeyContext = {};
    var hotkeyArgs = {date: Date.now()};

    if (args.code === null || args.code === void 0) { args.code = 1; }
    if (args.which === null || args.which === void 0) { args.which = 49; }

    var hotkey = Hotkeys.createHotkey({
      key: args.combo,
      context: hotkeyContext,
      args: hotkeyArgs,
      callback: jasmine.createSpy(args.combo)
    });
    expect(hotkey).not.toBeUndefined();

    Hotkeys.registerHotkey(hotkey);
    expect(Hotkeys._registerKey).toHaveBeenCalled();

    var event = createEvent(args);
    expect(args.combo).toEqual(Hotkeys.keyStringFromEvent(event));
    sendKeydown(event);
    expect(hotkey.callback).toHaveBeenCalled();

    expect(hotkey.callback.calls.first()).toEqual({
      object: hotkeyContext,
      args: [event, hotkeyArgs],
      returnValue: void 0
    });

    Hotkeys.deregisterHotkey(hotkey);
    expect(Hotkeys._hotkeys[hotkey.key]).toEqual(jasmine.any(Array));
    expect(Hotkeys._hotkeys[hotkey.key].length).toEqual(0);
  };

  beforeEach(module('fps.hotkeys'));

  beforeEach(inject(function(_$Hotkeys_) {
    var Mutable = MutableHotkeys(_$Hotkeys_);
    Hotkeys = new Mutable();
    spyOn(Hotkeys, '_registerKey').and.callThrough();
  }));

  //  Combos
  //  ctrl + <key>
  //  ctrl + alt + <key>
  //  ctrl + alt + shift + <key>
  //  ctrl + alt + shift + meta + <key>
  //  ctrl + shift + <key>
  //  ctrl + shift + meta + <key>
  //  ctrl + meta + <key>
  //
  //  alt + <key>
  //  alt + shift + <key>
  //  alt + shift + meta + <key>
  //  alt + meta + <key>
  //
  //  shift + <key>
  //  shift + meta + <key>
  //
  //  meta + <key>
  //
  //  <key>
  it('Combo hotkeys', function() {
    //  ctrl + <key>
    invokeHotkey({combo: 'ctrl+1', ctrlKey: true});

    //  ctrl + alt + <key>
    invokeHotkey({combo: 'ctrl+alt+1', ctrlKey: true, altKey: true});

    //  ctrl + alt + shift + <key>
    invokeHotkey({combo: 'ctrl+alt+shift+1', ctrlKey: true, altKey: true, shiftKey: true});

    //  ctrl + alt + shift + meta + <key>
    invokeHotkey({combo: 'ctrl+alt+shift+meta+1', ctrlKey: true, altKey: true, shiftKey: true, metaKey: true});

    //  ctrl + shift + <key>
    invokeHotkey({combo: 'ctrl+shift+1', ctrlKey: true, shiftKey: true});

    //  ctrl + shift + meta + <key>
    invokeHotkey({combo: 'ctrl+shift+meta+1', ctrlKey: true, shiftKey: true, metaKey: true});

    //  ctrl + meta + <key>
    invokeHotkey({combo: 'ctrl+meta+1', ctrlKey: true, metaKey: true});

    //  alt + <key>
    invokeHotkey({combo: 'alt+1', altKey: true});
    //  alt + shift + <key>
    invokeHotkey({combo: 'alt+shift+1', altKey: true, shiftKey: true});
    //  alt + shift + meta + <key>
    invokeHotkey({combo: 'alt+shift+meta+1', altKey: true, shiftKey: true, metaKey: true});
    //  alt + meta + <key>
    invokeHotkey({combo: 'alt+meta+1', altKey: true, metaKey: true});

    //  shift + <key>
    invokeHotkey({combo: 'shift+1', shiftKey: true});
    //  shift + meta + <key>
    invokeHotkey({combo: 'shift+meta+1', shiftKey: true, metaKey: true});

    // meta + <key>
    invokeHotkey({combo: 'meta+1', metaKey: true});

    // Numpad
    invokeHotkey({combo: '0', code: '0', which: 96});
    invokeHotkey({combo: '1', code: '1', which: 97});
    invokeHotkey({combo: '2', code: '2', which: 98});
    invokeHotkey({combo: '3', code: '3', which: 99});
    invokeHotkey({combo: '4', code: '4', which: 100});
    invokeHotkey({combo: '5', code: '5', which: 101});
    invokeHotkey({combo: '6', code: '6', which: 102});
    invokeHotkey({combo: '7', code: '7', which: 103});
    invokeHotkey({combo: '8', code: '8', which: 104});
    invokeHotkey({combo: '9', code: '9', which: 105});
    invokeHotkey({combo: '*', code: '*', which: 106});
    invokeHotkey({combo: '+', code: '+', which: 107});
    invokeHotkey({combo: '-', code: '-', which: 109});
    invokeHotkey({combo: '.', code: '.', which: 110});
    invokeHotkey({combo: '/', code: '/', which: 111});
  });
});

