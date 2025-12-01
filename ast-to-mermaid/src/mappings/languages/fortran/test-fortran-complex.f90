program ComplexIO
  implicit none
  integer :: i, j
  real :: x, y
  character(len=20) :: name
  
  ! Basic print
  print *, 'Starting program'
  
  ! Print with variables
  print *, 'i = ', i, ' j = ', j
  
  ! Print with expressions
  print *, 'Sum: ', i + j, ' Product: ', i * j
  
  ! Print with formatting
  print '(A, F6.2)', 'Value of x: ', x
  
  ! Loop with print
  do i = 1, 5
    print *, 'Iteration ', i
  end do
  
  ! Conditional print
  if (i > 0) then
    print *, 'Positive value: ', i
  end if
  
  ! Final print
  print *, 'Program completed'
  
end program ComplexIO