import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Aimotors from './Aimotors';
import axios from 'axios';

// Mock axios post method
jest.mock('axios');

const mockSetCalculatedPrice = jest.fn();

describe('Aimotors Component', () => {
  test('renders the form and handles validation and submission', async () => {
    // Render the component wrapped in MemoryRouter
    render(
      <MemoryRouter>
        <Aimotors setCalculatedPrice={mockSetCalculatedPrice} />
      </MemoryRouter>
    );
    
    // Get form elements
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const colourSelect = screen.getByText('Select a Colour');
    const seatMaterialSelect = screen.getByText('Select Seat Material');
    const performanceSelect = screen.getByText('Select Performance');
    const seatsSelect = screen.getByText('Select Number of Seats');
    const calculateButton = screen.getByText('Calculate');
    
    // Submit the form without filling it out to check for validation errors
    fireEvent.click(calculateButton);
    
    // Check validation errors
    expect(screen.getByText('First name must be at least 2 characters.')).toBeInTheDocument();
    expect(screen.getByText('Last name must be at least 2 characters.')).toBeInTheDocument();
    expect(screen.getByText('Email should be in the format firstname.lastname@gmail.com.')).toBeInTheDocument();
    expect(screen.getByText('Please select a car colour.')).toBeInTheDocument();
    expect(screen.getByText('Please select a seat material.')).toBeInTheDocument();
    expect(screen.getByText('Please select a performance level.')).toBeInTheDocument();
    expect(screen.getByText('Please select the number of seats.')).toBeInTheDocument();

    // Fill out the form correctly
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@gmail.com' } });
    fireEvent.change(colourSelect, { target: { value: 'White' } });
    fireEvent.change(seatMaterialSelect, { target: { value: 'Fabric' } });
    fireEvent.change(performanceSelect, { target: { value: 'Normal' } });
    fireEvent.change(seatsSelect, { target: { value: '4' } });
    
    // Mock axios response
    axios.post.mockResolvedValueOnce({ data: { price: 50000 } });
    
    // Submit the form
    fireEvent.click(calculateButton);
    
    // Wait for the async submission to complete
    await waitFor(() => {
      // Check if the price has been set
      expect(mockSetCalculatedPrice).toHaveBeenCalledWith(50000);
      // Check if the popup is shown
      expect(screen.getByText('Thanks For Your Patience. You Can View Your calculated Price Above')).toBeInTheDocument();
    });
  });

  test('handles API error correctly', async () => {
    // Render the component wrapped in MemoryRouter
    render(
      <MemoryRouter>
        <Aimotors setCalculatedPrice={mockSetCalculatedPrice} />
      </MemoryRouter>
    );
    
    // Fill out the form correctly
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@gmail.com' } });
    fireEvent.change(screen.getByText('Select a Colour'), { target: { value: 'White' } });
    fireEvent.change(screen.getByText('Select Seat Material'), { target: { value: 'Fabric' } });
    fireEvent.change(screen.getByText('Select Performance'), { target: { value: 'Normal' } });
    fireEvent.change(screen.getByText('Select Number of Seats'), { target: { value: '4' } });
    
    // Mock axios error response
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Something went wrong' } } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Calculate'));
    
    // Wait for the async submission to complete
    await waitFor(() => {
      // Check if an error alert is shown
      expect(window.alert).toHaveBeenCalledWith('Error: Something went wrong');
    });
  });
});
