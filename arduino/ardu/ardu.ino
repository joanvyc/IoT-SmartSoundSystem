#define btn  42
#define ledY 12
#define ledB 10
#define ledG 8
#define ledW 6
#define ledR 4
#define ldr  A12
#define chill_max 500
#define medium_max 800
#define off '4'
#define chill '1'
#define medium '2'
#define rave '3'

char mode; // 1 chill, 2 medium, 3 disco, 4 off

// chill mode
int brightness = 100;
int bright_state = 1; // 0 decrease, 1 augmentar
int bright_step = 5;


// medium mode
int led_on = 0; // 0 outer, 1 middle, 2 inner
int middle_status = 0; //0 decrementar, 1 incrementar

// rave mode
int rand_num;
int rand_on;

int light;

void setup() {
  pinMode (btn, INPUT);
  pinMode (ledY, OUTPUT);
  pinMode (ledB, OUTPUT);
  pinMode (ledG, OUTPUT);
  pinMode (ledW, OUTPUT);
  pinMode (ledR, OUTPUT);
  Serial.begin(9600);
  
  randomSeed(analogRead(0));
  mode = 1;

}

void chill_mode() { 
  analogWrite(ledY, brightness);
  analogWrite(ledB, brightness);
  analogWrite(ledG, brightness);
  analogWrite(ledW, brightness);
  analogWrite(ledR, brightness);
  if (bright_state) { //incrementar
    if (brightness < 100) {
      brightness += bright_step;
      delay(200);
    }
    else {
      brightness = 100;
      bright_state = 0;
    }
  }
  else { // decrementar
    if (brightness > 0)  {
      brightness -= bright_step;
      delay(200);
    }
    else {
      brightness = 0;
      bright_state = 1;
    }
  }
  
}

void medium_mode() {
  switch (led_on) {
    case 0: //outer
      analogWrite(ledY, 50);
      analogWrite(ledB, 0);
      analogWrite(ledG, 0);
      analogWrite(ledW, 0);
      analogWrite(ledR, 50);
      break;
    case 1: // middle
      analogWrite(ledY, 0);
      analogWrite(ledB, 100);
      analogWrite(ledG, 0);
      analogWrite(ledW, 100);
      analogWrite(ledR, 0);
      break;
    default: //inner
      analogWrite(ledY, 0);
      analogWrite(ledB, 0);
      analogWrite(ledG, 150);
      analogWrite(ledW, 0);
      analogWrite(ledR, 0);
      break;
  }

  delay(500);
  if (led_on == 2 || led_on == 0) middle_status ^= 1;
  if (middle_status) led_on++;
  else led_on--;
  
}

void rave_mode() {
  rand_num = random(0, 255);
  rand_on = rand_num * random(0, 1);
  analogWrite(ledY, rand_num);
  analogWrite(ledB, (rand_num+62)%255);
  analogWrite(ledG, (rand_num-73));
  analogWrite(ledW, rand_num);
  analogWrite(ledR, (rand_num+171)%255);
  delay(100);
}

void loop() {

  light = analogRead(ldr);
  char light_lvl;
  if (light < chill_max) light_lvl = '1';
  else if (light < medium_max) light_lvl = '2';
  else light_lvl = '3';
  
  
  if (Serial.available() > 0) {
    char new_mode = Serial.read();
    
    if (new_mode != 0) mode = new_mode;
    Serial.write(light_lvl);
     // mirar maxims be
  }
  
  switch (mode) {
    case off: //apagat
      digitalWrite(ledY, LOW);
      digitalWrite(ledB, LOW);
      digitalWrite(ledG, LOW);
      digitalWrite(ledW, LOW);
      digitalWrite(ledR, LOW);
      break;
    case chill: // chill
      chill_mode();
      break;
    case medium: // medium
      medium_mode();
      break;
    default: // disco
      rave_mode();
      break;
  }

  /*Serial.println(light);*/

}
