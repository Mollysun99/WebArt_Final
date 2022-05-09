function Ticker( elem ) {
	elem.lettering();
	this.done = false;
	this.cycleCount = 5;
	this.cycleCurrent = 0;
	this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+{}|[]\\;\':"<>?,./`~'.split('');
	this.charsCount = this.chars.length;
	this.letters = elem.find( 'span' );
	this.letterCount = this.letters.length;
	this.letterCurrent = 0;

	this.letters.each( function() {
		var $this = $( this );
		$this.attr( 'data-orig', $this.text() );
		$this.text( '-' );
	});
}

Ticker.prototype.getChar = function() {
	return this.chars[ Math.floor( Math.random() * this.charsCount ) ];
};

Ticker.prototype.reset = function() {
	this.done = false;
	this.cycleCurrent = 0;
	this.letterCurrent = 0;
	this.letters.each( function() {
		var $this = $( this );
		$this.text( $this.attr( 'data-orig' ) );
		$this.removeClass( 'done' );
	});
	this.loop();
};

Ticker.prototype.loop = function() {
	var self = this;

	this.letters.each( function( index, elem ) {
		var $elem = $( elem );
		if( index >= self.letterCurrent ) {
			if( $elem.text() !== ' ' ) {
				$elem.text( self.getChar() );
				$elem.css( 'opacity', Math.random() );
			}
		}
	});

	if( this.cycleCurrent < this.cycleCount ) {
		this.cycleCurrent++;
	} else if( this.letterCurrent < this.letterCount ) {
		var currLetter = this.letters.eq( this.letterCurrent );
		this.cycleCurrent = 0;
		currLetter.text( currLetter.attr( 'data-orig' ) ).css( 'opacity', 1 ).addClass( 'done' );
		this.letterCurrent++;
	} else {
		this.done = true;
	}

	if( !this.done ) {
		requestAnimationFrame( function() {
			self.loop();
		});
	} else {
		setTimeout( function() {
			self.reset();
		}, 750 );
	}
};

$words = $( '.word' );

$words.each( function() {
	var $this = $( this ),
		ticker = new Ticker( $this ).reset();
	$this.data( 'ticker', ticker  );
});


// document.addEventListener("keydown", enterMainScreen, false);

// function enterMainScreen(input) {
//    if(input.keyCode == 13){ // enter key
//     document.getElementById("loading").style.display = "none"; // block
//     document.getElementById("description").style.display = "none"; // block
//    }
// }



class Hardware {
    constructor(light) {
      this.light = light;
      this.state = 'off';
    }
  
    on() {
      this.state = 'on';
      this.light.removeClass("lightOff");
      this.light.addClass("lightOn");
    }
  
    off() {
      this.state = 'off';
      this.light.removeClass("lightOn");
      this.light.addClass("lightOff");
    }
  
    isOn() {
      return this.state == 'on';
    }
  
    power() {
      if (this.isOn()) {
        this.off();
      } else {
        this.on();
      }
    }}
  
  
  
  
  class Screen extends Hardware {
    constructor(output, light) {
      super(light);
      this.output = output;
      this.output.hide();
      this.output.parent().removeClass("screenEffect");
      this.noSignalMode = false;;
    }
  
    write(text, leftOffset) {
      if (leftOffset) {
        var $span = $(document.createElement("span"));
        $span.append(text + "<br/>");
        $span.css("padding-left", leftOffset + "px");
        this.output.append($span);
      } else {
        this.output.append(text + "<br/>");
      }
      this.scroll();
    }
  
    scroll() {
      this.output.animate({
        scrollTop: $(".output").height() },
      0);
    }
  
    newLine() {
      this.output.append("<br/>");
    }
  
    clear() {
      this.output.empty();
    }
  
    input(centralUnit) {
      this.output.append("Press ENTER Key to travel through time> ");
      var $input = $(document.createElement("input"));
      $input.addClass("terminalInput");
      this.output.append($input);
      this.output.append("<br/>");
      $input.focus();
      var screen = this;
      $input.on("keypress", function (event) {
        if (event.which == 13) {
          // centralUnit.command(screen, $input.val());
          // $input.prop("disabled", true);
          // screen.input(centralUnit);
          document.getElementById("behind").style.display = "none";
          document.getElementById("computer").style.display = "none";
          // console.log("delete start screen");
          document.getElementById("loading").style.display = "block";
          // document.getElementById("overlay").style.display = "block";
          document.getElementById("description").style.display = "block";
          setTimeout(function(){
            // location.reload();
            window.location.href = "welcome.html";
          }, 3000);
        //   setTimeout(function(){
        //     window.location.href = 'https://www.google.co.in';
        //  }, 3000);
        }
      });
    }
  
    on(callback) {
      super.on();
      var screen = this;
      this.output.parent().addClass("screenEffect");
      this.output.show();
      this.output.delay(1000).queue(function (next) {
        next();
        screen.write("Checking connections to memory...");
        screen.output.delay(2000).queue(function (next) {
          next();
          callback();
        });
      });
    }
  
    off() {
      super.off();
      var screen = this;
      if (this.noSignalMode) {
        this.signal();
      }
      this.write("Disconnecting...");
      this.output.delay(2000).queue(function (next) {
        next();
        screen.output.hide();
        screen.output.parent().removeClass("screenEffect");
      });
    }
  
    signal() {
      this.output.find("#noSignal").remove();
    }
  
    power(centralUnit, callback) {
      if (this.isOn()) {
        this.off();
        callback(true);
      } else {
        var screen = this;
        var connection = false;
        this.on(function () {
          if (!centralUnit.isOn()) {
            screen.noSignal();
            callback(connection);
          } else {
            if (centralUnit.isBoot()) {
              centralUnit.terminal(screen);
            }
            connection = true;
            callback(connection);
          }
        });
      }
    }
  
    connect(callback) {
      var screen = this;
      this.output.delay(1000).queue(function (next) {
        next();
        if (screen.noSignalMode) {
          screen.noSignalMode = false;
          screen.signal();
        }
        screen.write("Memory Storage Machine initialized");
        callback();
      });
    }
  
    noSignal() {
      this.noSignalMode = true;
      var $popup = $(document.createElement("div"));
      $popup.addClass("popup");
      $popup.addClass("screenEffect");
      $popup.attr("id", "noSignal");
      $popup.text("NO SIGNAL");
      this.output.append($popup);
    }}
  
  
  class CentralUnit extends Hardware {
    constructor(button, light) {
      super(light);
      this.button = button;
      this.bootStatus = false;
    }
  
    on(screen, callback) {
      super.on();
      this.button.removeClass("computerButtonOff");
      this.button.addClass("computerButtonOn");
      screen.connect(function () {
        callback();
      });
    }
  
    off(screen) {
      super.off();
      this.button.removeClass("computerButtonOn");
      this.button.addClass("computerButtonOff");
      this.bootStatus = false;
      screen.clear();
    }
  
    power(screen) {
      if (this.isOn()) {
        this.off(screen);
        if (screen.isOn()) {
          screen.output.delay(1000).queue(function (next) {
            next();
            screen.noSignal();
          });
        }
      } else {
        var centralUnit = this;
        this.on(screen, function () {
          centralUnit.boot(screen);
        });
      }
    }
  
    date() {
      var date = new Date();
      var dayNumbers = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
      return dayNumbers[date.getDay()] + " " + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();
    }
  
    terminal(screen) {
      screen.newLine();
      screen.input(this);
      screen.scroll();
    }
  
    command(screen, command) {
      if (command != "") {
        screen.write("Command not supported yet.");
      }
    }
  
    isBoot() {
      return this.bootStatus;
    }
  
    boot(screen) {
      var centralUnit = this;
      screen.output.delay(1000).queue(function (next) {
        next();
        screen.write("Booting up...");
        screen.output.delay(200).queue(function (next) {
          next();
          screen.newLine();
          screen.write("You can use this machine to find your memories:");
          screen.output.delay(200).queue(function (next) {
            next();
            screen.newLine();
            screen.write("No one could stole them", 20);
            screen.output.delay(200).queue(function (next) {
              next();
              screen.write("They are safe here", 20);
              screen.output.delay(200).queue(function (next) {
                next();
                screen.write("Have Fun :)", 20);
                screen.output.delay(200).queue(function (next) {
                  next();
                  screen.newLine();
                  screen.write("Current date is " + centralUnit.date());
                  screen.output.delay(200).queue(function (next) {
                    next();
                    screen.newLine();
                    screen.write("Memory Storage Machine");
                    screen.output.delay(200).queue(function (next) {
                      next();
                      screen.write("Version 2.84 Copyright Ruoxiao Sun 2022");
                      screen.output.delay(200).queue(function (next) {
                        next();
                        centralUnit.terminal(screen);
                        centralUnit.bootStatus = true;
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    }}
  
  
  class Computer {
    constructor(centralUnit, screen) {
      this.centralUnit = centralUnit;
      this.screen = screen;
      this.connection = false;
    }
  
    startScreen() {
      var computer = this;
      this.screen.power(this.centralUnit, function (connection) {
        computer.connection = connection;
      });
    }
  
    startCentralUnit() {
      this.centralUnit.power(this.screen);
    }}
  
  
  var screen = new Screen($(".output"), $(".screenBox").find(".powerLight"));
  var centralUnit = new CentralUnit($(".computerButton"), $(".computer").find(".powerLight"));
  var computer = new Computer(centralUnit, screen);
  
  $(".screenBox").find(".powerButton").on("click", function () {
    computer.startScreen();
  });
  
  $(".computerButton").on("click", function () {
    computer.startCentralUnit();
  });
  
  computer.startScreen();
  computer.centralUnit.button.delay(2000).queue(function (next) {
    computer.startCentralUnit();
  });



  