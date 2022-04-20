#pragma once

#include <myTypes.h>
#include <profile.h>

namespace resp32flow
{
  class RelayIState
  {
  protected:
    bool m_isOn = false;

  public:
    virtual bool isOn() const { return m_isOn; }
    virtual void setIsOn(bool a_state) { m_isOn = a_state; }

    virtual resp32flow::Profile *getCurentProfile() const;
    virtual resp32flow::ProfileStep *getCurrentProfileStep() const;
    virtual resp32flow::ProfileStep *getNextProfileStep() const;
    virtual resp32flow::time_t getStepTimer() const;

    virtual void toJSON(ArduinoJson6194_F1::ObjectRef &a_jsonObject) const;
    virtual void fromJSON();
  };
} // namespace resp32flow
