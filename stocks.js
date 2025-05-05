const POLYGON_API_KEY = 'FMLNBAHeeYkTAKW98NgfhpqpeiLoFe48'; 
let stockChart = null;

function pageSpecificCommands() {
  return {
    'lookup *stock': function(stock) {
      document.getElementById('ticker').value = stock.toUpperCase();
      lookupStock();
    }
  };
}

function lookupStock() {
  const ticker = document.getElementById('ticker').value.toUpperCase();
  const timeRange = document.getElementById('time-range').value;
  
  if (!ticker) {
    alert('Please enter a stock ticker');
    return;
  }
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - parseInt(timeRange));
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  
  const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedStartDate}/${formattedEndDate}?apiKey=${POLYGON_API_KEY}`;
  
  document.getElementById('stock-chart').innerHTML = 'Loading...';
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.resultsCount === 0) {
        alert('No data found for the specified ticker and date range');
        return;
      }
      
      displayStockChart(data.results, ticker);
    })
    .catch(error => {
      console.error('Error fetching stock data:', error);
      alert('Error fetching stock data. Please try again.');
    });
}

function displayStockChart(stockData, ticker) {
  const labels = [];
  const prices = [];
  
  stockData.forEach(item => {
    const date = new Date(item.t);
    labels.push(date.toLocaleDateString());
    
    prices.push(item.c);
  });
  
  const ctx = document.getElementById('stock-chart').getContext('2d');
  
  if (stockChart) {
    stockChart.destroy();
  }
  
  stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${ticker} Stock Price`,
        data: prices,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Price'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });
}

function fetchRedditStocks() {
  fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
    .then(response => response.json())
    .then(data => {
    
      const topStocks = data.slice(0, 5);
      
      const tableBody = document.querySelector('#reddit-stocks tbody');
      tableBody.innerHTML = '';
      
      topStocks.forEach(stock => {
        const row = document.createElement('tr');
        
        const tickerCell = document.createElement('td');
        const tickerLink = document.createElement('a');
        tickerLink.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
        tickerLink.textContent = stock.ticker;
        tickerLink.target = '_blank';
        tickerCell.appendChild(tickerLink);
        
        const commentCell = document.createElement('td');
        commentCell.textContent = stock.no_of_comments;
        
        const sentimentCell = document.createElement('td');
        const sentimentText = document.createElement('span');
        sentimentText.textContent = stock.sentiment;
        
        const sentimentIcon = document.createElement('img');
        sentimentIcon.classList.add('sentiment-icon');
        
        if (stock.sentiment === 'Bullish') {
          sentimentIcon.src = 'assets/bullish.png';
          sentimentIcon.alt = 'Bullish Icon';
        } else {
          sentimentIcon.src = 'assets/bearish.png';
          sentimentIcon.alt = 'Bearish Icon';
        }
        
        sentimentCell.appendChild(sentimentText);
        sentimentCell.appendChild(document.createTextNode(' '));
        sentimentCell.appendChild(sentimentIcon);
        
        row.appendChild(tickerCell);
        row.appendChild(commentCell);
        row.appendChild(sentimentCell);
        
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching Reddit stocks:', error);
      document.querySelector('#reddit-stocks tbody').innerHTML = '<tr><td colspan="3">Error loading Reddit stocks</td></tr>';
    });
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('lookup-stock').addEventListener('click', lookupStock);
  
  fetchRedditStocks();
});
