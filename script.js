document.addEventListener('DOMContentLoaded', function() {
    // Set min date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('visitDate').min = formattedDate;
    document.getElementById('visitDate').value = formattedDate;
    
    // Sample data structure for provinces, cities, destinations, and ticket types
    // In a real application, this would likely be fetched from an API
    const tourismData = {
        "Bali": {
            "Denpasar": {
                "Sanur Beach": {
                    "Regular": 50000,
                    "VIP": 150000
                },
                "Bali Museum": {
                    "Regular": 30000,
                    "Student": 15000,
                    "International": 75000
                }
            },
            "Badung": {
                "Kuta Beach": {
                    "Regular": 25000,
                    "VIP Access": 100000
                },
                "Tanah Lot Temple": {
                    "Regular": 60000,
                    "Sunset Package": 120000,
                    "Photography Package": 200000
                }
            },
            "Gianyar": {
                "Tegalalang Rice Terraces": {
                    "Regular": 85000,
                    "Guided Tour": 150000
                },
                "Ubud Monkey Forest": {
                    "Regular": 80000,
                    "Premium": 120000
                }
            }
        },
        "Jawa Barat": {
            "Bandung": {
                "Tangkuban Perahu": {
                    "Regular": 30000,
                    "VIP": 100000
                },
                "Dago Dreampark": {
                    "Regular": 45000,
                    "All Access": 120000,
                    "Family Package": 200000
                }
            },
            "Bogor": {
                "Kebun Raya Bogor": {
                    "Regular": 25000,
                    "Guided Tour": 70000
                },
                "Taman Safari Indonesia": {
                    "Regular": 220000,
                    "Safari Journey": 350000,
                    "Full Experience": 450000
                }
            }
        },
        "Yogyakarta": {
            "Sleman": {
                "Prambanan Temple": {
                    "Regular": 50000,
                    "International": 225000,
                    "Sunset Package": 150000
                },
                "Merapi Volcano Tour": {
                    "Regular": 300000,
                    "Jeep Adventure": 500000
                }
            },
            "Bantul": {
                "Parangtritis Beach": {
                    "Regular": 10000,
                    "Horse Riding Package": 50000
                },
                "Mangunan Fruit Garden": {
                    "Regular": 15000,
                    "Fruit Picking Experience": 100000
                }
            },
            "Yogyakarta City": {
                "Kraton Yogyakarta": {
                    "Regular": 15000,
                    "Guided Tour": 75000
                },
                "Malioboro Street": {
                    "Walking Tour": 50000,
                    "Cultural Experience": 150000
                }
            }
        },
        "DKI Jakarta": {
            "Jakarta Pusat": {
                "National Monument (Monas)": {
                    "Regular": 15000,
                    "Top Deck Access": 50000
                },
                "National Museum": {
                    "Regular": 10000,
                    "Student": 5000,
                    "International": 25000
                }
            },
            "Jakarta Timur": {
                "Taman Mini Indonesia Indah": {
                    "Regular": 20000,
                    "All Access": 120000,
                    "Family Package": 250000
                }
            },
            "Jakarta Selatan": {
                "Ragunan Zoo": {
                    "Regular": 5000,
                    "Children": 3000
                }
            }
        }
    };
    
    // DOM Elements
    const provinceSelect = document.getElementById('provinceSelect');
    const citySelect = document.getElementById('citySelect');
    const destinationSelect = document.getElementById('destinationSelect');
    const ticketTypeSelect = document.getElementById('ticketTypeSelect');
    const ticketCount = document.getElementById('ticketCount');
    const visitDate = document.getElementById('visitDate');
    const decrementBtn = document.getElementById('decrementBtn');
    const incrementBtn = document.getElementById('incrementBtn');
    const bookNowBtn = document.getElementById('bookNowBtn');
    const bookingSummary = document.getElementById('bookingSummary');
    
    // Initialize provinces dropdown
    function initializeProvinces() {
        for (const province in tourismData) {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        }
    }
    
    // Event listeners for dropdown changes
    provinceSelect.addEventListener('change', function() {
        resetDropdown(citySelect);
        resetDropdown(destinationSelect);
        resetDropdown(ticketTypeSelect);
        updateBookingButton();
        
        if (this.value) {
            citySelect.disabled = false;
            populateCities(this.value);
        } else {
            citySelect.disabled = true;
            destinationSelect.disabled = true;
            ticketTypeSelect.disabled = true;
        }
    });
    
    citySelect.addEventListener('change', function() {
        resetDropdown(destinationSelect);
        resetDropdown(ticketTypeSelect);
        updateBookingButton();
        
        if (this.value) {
            destinationSelect.disabled = false;
            populateDestinations(provinceSelect.value, this.value);
        } else {
            destinationSelect.disabled = true;
            ticketTypeSelect.disabled = true;
        }
    });
    
    destinationSelect.addEventListener('change', function() {
        resetDropdown(ticketTypeSelect);
        updateBookingButton();
        
        if (this.value) {
            ticketTypeSelect.disabled = false;
            populateTicketTypes(provinceSelect.value, citySelect.value, this.value);
        } else {
            ticketTypeSelect.disabled = true;
        }
    });
    
    ticketTypeSelect.addEventListener('change', function() {
        updateBookingSummary();
        updateBookingButton();
    });
    
    // Populate city dropdown based on selected province
    function populateCities(province) {
        const cities = Object.keys(tourismData[province]);
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
    
    // Populate destinations dropdown based on selected province and city
    function populateDestinations(province, city) {
        const destinations = Object.keys(tourismData[province][city]);
        
        destinations.forEach(destination => {
            const option = document.createElement('option');
            option.value = destination;
            option.textContent = destination;
            destinationSelect.appendChild(option);
        });
    }
    
    // Populate ticket types dropdown based on selected province, city, and destination
    function populateTicketTypes(province, city, destination) {
        const ticketTypes = Object.keys(tourismData[province][city][destination]);
        
        ticketTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type + ' - Rp ' + tourismData[province][city][destination][type].toLocaleString('id-ID');
            ticketTypeSelect.appendChild(option);
        });
    }
    
    // Reset dropdown to initial state
    function resetDropdown(dropdown) {
        dropdown.innerHTML = '<option value="" selected>Select ' + dropdown.id.replace('Select', '') + '</option>';
    }
    
    // Update booking button state
    function updateBookingButton() {
        if (provinceSelect.value && 
            citySelect.value && 
            destinationSelect.value && 
            ticketTypeSelect.value && 
            visitDate.value && 
            parseInt(ticketCount.value) > 0) {
            bookNowBtn.disabled = false;
        } else {
            bookNowBtn.disabled = true;
        }
    }
    
    // Ticket counter functionality
    decrementBtn.addEventListener('click', function() {
        if (parseInt(ticketCount.value) > 1) {
            ticketCount.value = parseInt(ticketCount.value) - 1;
            updateBookingSummary();
        }
    });
    
    incrementBtn.addEventListener('click', function() {
        if (parseInt(ticketCount.value) < 10) {
            ticketCount.value = parseInt(ticketCount.value) + 1;
            updateBookingSummary();
        }
    });
    
    ticketCount.addEventListener('input', function() {
        if (parseInt(this.value) < 1) {
            this.value = 1;
        } else if (parseInt(this.value) > 10) {
            this.value = 10;
        }
        updateBookingSummary();
    });
    
    visitDate.addEventListener('change', function() {
        updateBookingSummary();
        updateBookingButton();
    });
    
    // Update booking summary
    function updateBookingSummary() {
        if (provinceSelect.value && 
            citySelect.value && 
            destinationSelect.value && 
            ticketTypeSelect.value && 
            visitDate.value) {
            
            const province = provinceSelect.value;
            const city = citySelect.value;
            const destination = destinationSelect.value;
            const ticketType = ticketTypeSelect.value;
            const count = parseInt(ticketCount.value);
            const date = new Date(visitDate.value);
            const formattedDate = date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const pricePerTicket = tourismData[province][city][destination][ticketType];
            const totalPrice = pricePerTicket * count;
            
            document.getElementById('summaryDestination').textContent = destination + ', ' + city + ', ' + province;
            document.getElementById('summaryTicketType').textContent = ticketType;
            document.getElementById('summaryDate').textContent = formattedDate;
            document.getElementById('summaryTicketCount').textContent = count + ' ticket(s)';
            document.getElementById('summaryPrice').textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');
            
            bookingSummary.style.display = 'block';
        } else {
            bookingSummary.style.display = 'none';
        }
    }
    
    // Book Now button click event
    bookNowBtn.addEventListener('click', function() {
        alert('Booking successful! Thank you for choosing TravelEase.');
    });
    
    // Initialize the first dropdown
    initializeProvinces();
});