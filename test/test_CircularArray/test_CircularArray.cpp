#include <unity.h>
#include <CircularArray.h>

void test_append_and_get()
{
  CircularArray<int, 10> circularArray;
  for (size_t i = 0; i < 4; i++)
  {
    circularArray.append(i * 2);
  }
  TEST_ASSERT_EQUAL(4, circularArray.length());
  TEST_ASSERT_EQUAL_INT32(0, circularArray[0]);
  TEST_ASSERT_EQUAL_INT32(2, circularArray[1]);
  TEST_ASSERT_EQUAL_INT32(4, circularArray[2]);
  TEST_ASSERT_EQUAL_INT32(6, circularArray[3]);
}

void test_loop_back()
{
  CircularArray<int, 5> circularArray;
  for (size_t i = 0; i < 10; i++)
  {
    circularArray.append(i);
  }
  TEST_ASSERT_EQUAL_INT32(6, circularArray[1]);
  TEST_ASSERT_EQUAL_INT32(7, circularArray[2]);
  TEST_ASSERT_EQUAL_INT32(8, circularArray[3]);
}

void test_incomplet_loop()
{
  CircularArray<int, 5> circularArray;
  for (size_t i = 0; i < 8; i++)
  {
    circularArray.append(i);
  }
  TEST_ASSERT_EQUAL_INT32(4, circularArray[1]);
  TEST_ASSERT_EQUAL_INT32(5, circularArray[2]);
  TEST_ASSERT_EQUAL_INT32(6, circularArray[3]);
}

void test_out_of_bounds()
{
  CircularArray<int, 5> circularArray;
  for (size_t i = 0; i < 2; i++)
  {
    circularArray.append(i);
  }
  try
  {
    circularArray[4];
    TEST_ASSERT_EQUAL(2, circularArray.length());
    TEST_FAIL_MESSAGE("Should throw a out_of_range excpetion.");
  }
  catch (const std::exception &e)
  {
  }
}

void test_out_of_bounds_looped()
{
  CircularArray<int, 5> circularArray;
  for (size_t i = 0; i < 8; i++)
  {
    circularArray.append(i);
  }
  try
  {
    TEST_ASSERT_EQUAL_INT32(4, circularArray[1]);
    TEST_ASSERT_EQUAL(5, circularArray.length());
    circularArray[5];
    TEST_FAIL_MESSAGE("Should throw a out_of_range excpetion.");
  }
  catch (const std::exception &e)
  {
  }
}

void process()
{
  UNITY_BEGIN();
  RUN_TEST(test_append_and_get);
  RUN_TEST(test_loop_back);
  RUN_TEST(test_incomplet_loop);
  RUN_TEST(test_out_of_bounds);
  RUN_TEST(test_out_of_bounds_looped);
  UNITY_END();
}

#ifdef ARDUINO
#include <Arduino.h>
void setup()
{
  while (!Serial)
  {
    delay(10);
  };
  process();
};

void loop(){};

#else

int main(int argc, char const *argv[])
{
  process();
  return 0;
}
#endif