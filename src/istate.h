#pragma once
#include <string.h>
#include "profile.h"
#include <myTypes.h>

namespace resp32flow
{
  class IState
  {
  protected:
    bool m_isOn = false;

  public:
    virtual resp32flow::Profile &getCurentProfile() const;
    virtual resp32flow::ProfileStep &getCurrentProfileStep() const;
    virtual resp32flow::ProfileStep &getNextProfileStep() const;
    virtual resp32flow::time_t getStepTimer() const;

    virtual float getOvenTemp() const;
    virtual float getChipTemp() const;
    virtual int getUpdateInterval() const;

    virtual std::string toJSON() const;
    virtual void fromJSON();

    virtual bool isOn() const { return m_isOn; }
    virtual void setIsOn(bool a_state) { m_isOn = a_state; }
  };
}