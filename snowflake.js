;(function() {
  function Snowflake() {
    this.actions = {};
  };

  Snowflake.prototype = {
    // runs the passed action once, passing in an optional arg
    once: function(action, arg) {
      var id = this.id(action);
      if(this.actions[id] === undefined)
      {
        this.actions[id] = "whatever";
        return this.run(action, arg);
      }
    },

    // runs action every interval seconds, passing optional arg
    every: function(interval, action, arg) {
      var id = this.id(action);
      if(this.actions[id] === undefined)
      {
        this.actions[id] = {
          nextRun: this.calculateNextRun(interval)
        };
      }
      else if(this.actions[id].nextRun < new Date().getTime())
      {
        this.actions[id].nextRun = this.calculateNextRun(interval);
        return this.run(action, arg);
      }
    },

    // takes function, stringifies it and turns it into a hash to create an identifier
    id: function(action) {
      return this.hashString(action.toString());
    },

    run: function(action, arg) {
      // maybe if action is not function then just console.log
      return action(arg);
    },

    calculateNextRun: function(interval) {
      return new Date().getTime() + interval;
    },

    watchedValueAction: function(watchValues, watchValueTest, action, arg) {
      var id = this.id(action);
      if(this.actions[id] === undefined)
        this.actions[id] = { watchValues: watchValues };
      else
      {
        if(watchValueTest(this.actions[id].watchValues, watchValues) === true)
          this.run(action, arg);

        // update watchValues
        this.actions[id].watchValues = watchValues;
      }
    },

    // taken from: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    hashString: function(str) {
      var hash = 0;
	    if(str.length === 0)
        return hash;

	    for (i = 0; i < str.length; i++)
      {
	      var char = str.charCodeAt(i);
	      var hash = ((hash << 5) -hash ) + char;
	      hash = hash & hash;
	    }

	    return hash;
    },
  };

  this.Snowflake = Snowflake;
}).call(this);
