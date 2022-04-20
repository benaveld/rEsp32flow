#pragma once

#include <PID_v2.h>
#include <ReactESP.h>
#include <relayIState.h>

namespace resp32flow
{
  class RelayController : public RelayIState
  {
  private:
    const uint8_t m_relayPin;
    PID_v2 m_pid;

    Profile* m_selectedProfile = nullptr;
    size_t m_profileStep = 0;
    time_t m_stepTimer = 0;

  public:
    RelayController(decltype(m_relayPin) a_relayPin);
    void tick(reactesp::ReactESP &app);

    virtual resp32flow::Profile *getCurentProfile() const;
    virtual resp32flow::ProfileStep *getCurrentProfileStep() const;
    virtual resp32flow::ProfileStep *getNextProfileStep() const;
    virtual resp32flow::time_t getStepTimer() const;

    virtual void toJSON(ArduinoJson6194_F1::ObjectRef &a_jsonObject) const;
    virtual void fromJSON();
  };
} // namespace reflow