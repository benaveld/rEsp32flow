#include <unity.h>
#include <Arduino.h>
#include <profile.h>
#include <ArduinoJson.h>

using namespace resp32flow;

void test_profilestep_toJson()
{
  ProfileStep step;
  step.Kp = 3;
  step.Ki = 2;
  step.Kd = 4;
  step.targetTemp = 243;
  step.timer = 67;

  StaticJsonDocument<200> doc;
  auto jsonStep = doc.createNestedObject("step");
  step.toJSON(jsonStep);

  TEST_ASSERT_EQUAL(3, jsonStep["Kp"]);
  TEST_ASSERT_EQUAL(2, jsonStep["Ki"]);
  TEST_ASSERT_EQUAL(4, jsonStep["Kd"]);
  TEST_ASSERT_EQUAL(243, jsonStep["targetTemp"]);
  TEST_ASSERT_EQUAL(67, jsonStep["timer"]);
}

void test_profilestep_fromJson(){
  StaticJsonDocument<200> doc;
  char expected[] = "{'step':{'Kp': 3, 'Ki': 2, 'Kd': 4, 'targetTemp': 243, 'timer': 24}}";
  auto error = deserializeJson(doc, expected);
  if (error) {
    TEST_FAIL_MESSAGE("deserializeJson() failed");
  }
  auto jsonStep = doc["step"].as<JsonObjectConst>();

  ProfileStep step(jsonStep);

  TEST_ASSERT_EQUAL(jsonStep["Kp"], step.Kp);
  TEST_ASSERT_EQUAL(jsonStep["Ki"], step.Ki);
  TEST_ASSERT_EQUAL(jsonStep["Kd"], step.Kd);
  TEST_ASSERT_EQUAL(jsonStep["targetTemp"], step.targetTemp);
  TEST_ASSERT_EQUAL(jsonStep["timer"], step.timer);
}

void test_profile_toJson()
{
  ProfileStep step;
  step.Kp = 3;
  step.Ki = 2;
  step.Kd = 4;
  step.targetTemp = 243;
  step.timer = 67;

  Profile profile;
  profile.name = "testing name";
  profile.steps.push_back(step);


  StaticJsonDocument<200> doc;
  auto jsonProfile = doc.createNestedObject("profile");
  profile.toJSON(jsonProfile);

  TEST_ASSERT_EQUAL_STRING(profile.name.c_str(), jsonProfile["name"]);
  TEST_ASSERT_EQUAL(243, jsonProfile["steps"][0]["targetTemp"]);
}

void process()
{
  UNITY_BEGIN();
  RUN_TEST(test_profilestep_toJson);
  RUN_TEST(test_profilestep_fromJson);
  RUN_TEST(test_profile_toJson);
  UNITY_END();
}

void setup()
{
  while (!Serial)
  {
    delay(10);
  };
  process();
};

void loop(){};
