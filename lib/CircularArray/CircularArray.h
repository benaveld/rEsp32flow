#pragma once

#include <cstddef>
#include <stdexcept>

template <typename T, size_t Size, class A = std::allocator<T>>
class CircularArray
{
private:
  size_t m_head = 0;
  size_t m_tail = 0; // next empty spot
  bool m_looped = false;
  T *m_array;

public:
  class iterator
  {
  public:
    // iterator traits
    using difference_type = T;
    using value_type = T;
    using pointer = const T *;
    using reference = const T &;
    using iterator_category = std::random_access_iterator_tag;

  private:
    CircularArray<T, Size> &m_array;
    pointer m_currentElement;
    size_t m_index;

  public:
    iterator(decltype(m_array) a_array, size_t a_index = 0)
        : m_array(a_array), m_index(a_index),
          m_currentElement(m_index < a_array.length() ? &a_array[m_index] : nullptr)
    {
    }

    iterator &operator++()
    {
      m_index++;
      if (m_index < m_array.length())
      {
        m_currentElement = m_array[m_index];
      }
      return *this;
    }
    bool operator==(iterator other) const { return m_index == other.m_index; }
    bool operator!=(iterator other) const { return !(*this == other); }
    reference operator*() const { return m_currentElement; }
    pointer operator->() const { return &m_currentElement; }
  };

  static const auto maxSize = Size;

  const T &operator[](size_t a_index) const
  {
    if (a_index >= length())
      throw std::out_of_range("index out of bounds");

    a_index += m_head;
    if (a_index >= Size)
    {
      a_index -= Size;
    }

    return m_array[a_index];
  };

  T &operator[](size_t a_index)
  {
    if (a_index >= length())
      throw std::out_of_range("index out of bounds");

    a_index += m_head;
    if (a_index >= Size)
    {
      a_index -= Size;
    }

    return m_array[a_index];
  };

  void append(T &&a_value)
  {
    m_array[m_tail] = a_value;
    if (m_head == m_tail && m_looped)
    {
      m_head++;
      if (m_head >= Size)
      {
        m_head -= Size;
      }
    }

    m_tail++;
    if (m_tail >= Size)
    {
      m_tail -= Size;
      m_looped = true;
    }
  }

  size_t length() const
  {
    return m_tail > m_head ? m_tail - m_head : Size - m_head + m_tail;
  }

  iterator begin() { return iterator(this); }
  iterator end(){return iterator(this, length())};
};