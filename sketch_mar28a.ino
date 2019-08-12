#include <dht.h>                                              
#include <string.h>
using namespace std;
#define DHT11PIN 2                                            
dht DHT11;                                             
int potpin=1;
const int lightPin = A0; 

void setup() {                                                
Serial.begin(9600);                                          
pinMode(DHT11PIN,OUTPUT);  
pinMode(lightPin, INPUT);
}

void loop() {                                                
int chk = DHT11.read11(DHT11PIN);
if(analogRead(potpin)>500){
  Serial.print("T-");  

  Serial.print(DHT11.temperature);    
  
  Serial.print(";H-");    
  Serial.print(DHT11.humidity);   
  Serial.print(";L-"); 
  if(analogRead(lightPin)>900){
    Serial.print(analogRead(lightPin));    
  } else {
    Serial.print("light opened");
  }
  Serial.print(";B-");  
  Serial.print(analogRead(potpin));
}
Serial.println("");
delay(1000);                                         

}
