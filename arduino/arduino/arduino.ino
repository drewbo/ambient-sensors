
const int tempSensorPin = A0;
unsigned long prevTime = 0;
unsigned long currTime = 0;
long interval = 20000;

void setup() {
  Serial.begin(115200);
  // Setup complete.    
  Serial.println("SN:Setup Complete");
}

void loop() {
  currTime = millis();
  if (currTime - prevTime > interval) {
    prevTime = currTime;

    int tempSensorVal = analogRead(tempSensorPin);
    float tempSensorVolt = tempSensorVal / 1024.0 * 5.0;
    float temp = (tempSensorVolt - 0.5) * 100;
    Serial.print("TMP:");
    Serial.println(temp);

  }
}

// HELPER FUNCTIONS
void debug(const char* msg){  
  Serial.print("DBG:");
  Serial.println(msg);
}
void debug(char msg){
  Serial.print("DBG:");
  Serial.println(msg);
}
