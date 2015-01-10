var util = require('util');
var EventEmitter = require( "events" ).EventEmitter;

var SerialData = function() {
  // Store the events for which to emit.
  this.listeners = [];

  // Add new event to the emit list.
  this.listen = function(eventName, regex) {
    for (var i in this.listeners) {
      var obj = this.listeners[i];
      if (obj.eventn == eventName) {
        return false;
      }
    }    
    this.listeners.push({eventn: eventName, regex: new RegExp(regex)});
    return true;
  };

  // Process the data coming form the serialport.
  this.process = function(data) {
    // Clean carriage returns.
    data = data.replace(SerialData.CR_REGEX, '');
    var _self = this;

    // If a match was found in the listeners, do not emit 'other'
    var found = false;
    // Emit needed events
    _self.listeners.forEach(function(obj) {
      if (results = data.match(obj.regex)) {
        found = true;
        _self.emit(obj.eventn, results[1]);
      }
    });

    if (!found) {
      _self.emit('other', data);
    }

    return this;
  };

  // Add default listeners.
  this.listen('sysnote', SerialData.LISTEN_SYSNOTE);
  this.listen('debug', SerialData.LISTEN_DEBUG);
};

// Class constants
SerialData.LISTEN_DEBUG = '^DBG:(.*)';
SerialData.LISTEN_SYSNOTE = '^SN:(.*)';
SerialData.CR_REGEX = new RegExp('(^(\n|\r|\n\r))|((\n|\r|\n\r)$)');

// Make Serial data inherit from EventEmmiter.
util.inherits(SerialData, EventEmitter);

/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
SerialData.instance = null;
 
/**
 * Singleton getInstance definition
 * @return singleton class
 */
SerialData.getInstance = function(){
  if(this.instance === null){
    this.instance = new SerialData();
  }
  return this.instance;
};
 
module.exports = SerialData.getInstance();