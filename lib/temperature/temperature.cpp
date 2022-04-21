#include <temperature.h>

auto resp32flow::Temperature::getChipTempHistory() const -> const history_t&
{
  return m_chipHistory;
}

auto resp32flow::Temperature::getOvenTempHistory() const -> const history_t&
{
  return m_ovenHistory;
}

void resp32flow::Temperature::updateHistory()
{
  m_chipHistory.push(getChipTemp());
  m_ovenHistory.push(getOvenTemp());
}