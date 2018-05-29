
-- Blink using timer alarm --
timerId = 0
dly = 100
-- use D4
ledPin = 3
-- set mode to output
gpio.mode(ledPin,gpio.OUTPUT)
ledState = 0
-- timer loop
tmr.alarm( timerId, dly, 1, function()
  ledState = 1 - ledState;
  -- write state to D4
  gpio.write(ledPin, ledState)
end)