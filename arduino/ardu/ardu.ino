#define btn 42
#define ledY 12
#define ledB 10
#define ledG 8
#define ledW 6
#define ledR 4

int mode; // 0 off, 1 chill, 2 medium, 3 disco
int state = 0;
int old_val = 0;

// chill mode
int brightness = 130;
int bright_state = 1; // 0 decrease, 1 augmentar
int bright_step = 10;


// medium mode
int led_on = 0; // 0 outer, 1 middle, 2 inner
int middle_status = 0; //0 decrementar, 1 incrementar

// rave mode
int rand_num;

int btn_state;
int last_btn_state = LOW;
long last_deb_time = 0;
long ret_deb = 25;

void setup() {
  pinMode (btn, INPUT);
  pinMode (ledY, OUTPUT);
  pinMode (ledB, OUTPUT);
  pinMode (ledG, OUTPUT);
  pinMode (ledW, OUTPUT);
  pinMode (ledR, OUTPUT);
  
  randomSeed(analogRead(0));
  mode = 3;
}

void chill_mode() { 
  analogWrite(ledY, brightness);
  analogWrite(ledB, brightness);
  analogWrite(ledG, brightness);
  analogWrite(ledW, brightness);
  analogWrite(ledR, brightness);
  if (bright_state) { //incrementar
    if (brightness < 130) {
      brightness += bright_step;
      delay(150);
    }
    else {
      brightness = 130;
      bright_state = 0;
    }
  }
  else { // decrementar
    if (brightness > 0)  {
      brightness -= bright_step;
      delay(150);
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

  delay(400);
  if (led_on == 2 || led_on == 0) middle_status ^= 1;
  if (middle_status) led_on++;
  else led_on--;
  
}

void rave_mode() {
  rand_num = random(0, 255);
  int rand_on = random(0,1) * rand_num;
  analogWrite(ledY, rand_on);
  analogWrite(ledB, 0);
  analogWrite(ledG, 0);
  analogWrite(ledW, 0);
  analogWrite(ledR, 0);
  delay(300);
}

void loop() {
/*  int val = digitalRead(btn);
  if (val != old_val) {
    lastTimeDeb = millis();
    old_val = val;
  }
  if ((millis() - lastTimeDeb) > retDeb) {
    if (val != old
  }
  old_val = val;

  if (state) mode = (mode+1)%4;*/
  /*mode = (mode + 1)%4;*/
  
  switch (mode) {
    case 0: //apagat
      digitalWrite(ledY, LOW);
      digitalWrite(ledB, LOW);
      digitalWrite(ledG, LOW);
      digitalWrite(ledW, LOW);
      digitalWrite(ledR, LOW);
      break;
    case 1: // chill
      chill_mode();
      break;
    case 2: // medium
      medium_mode();
      break;
    default: // disco
      rave_mode();
      break;
  }

}
