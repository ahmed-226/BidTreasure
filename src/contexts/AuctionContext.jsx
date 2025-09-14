import React, { createContext, useContext, useState, useEffect } from 'react';

const AuctionContext = createContext();

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};

export const AuctionProvider = ({ children }) => {
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [userBids, setUserBids] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [watchedAuctions, setWatchedAuctions] = useState([]);

  
  useEffect(() => {
    const loadPersistedData = () => {
      try {
        const savedBids = JSON.parse(localStorage.getItem('bidtreasure_user_bids') || '[]');
        const savedWatched = JSON.parse(localStorage.getItem('bidtreasure_watched_auctions') || '[]');
        const savedNotifications = JSON.parse(localStorage.getItem('bidtreasure_auction_notifications') || '[]');
        
        setUserBids(savedBids);
        setWatchedAuctions(savedWatched);
        setNotifications(savedNotifications);
        
        
        initializeMockAuctions();
      } catch (error) {
        console.error('Error loading auction data:', error);
        initializeMockAuctions();
      }
    };

    loadPersistedData();
  }, []);

  
  useEffect(() => {
    localStorage.setItem('bidtreasure_user_bids', JSON.stringify(userBids));
  }, [userBids]);

  useEffect(() => {
    localStorage.setItem('bidtreasure_watched_auctions', JSON.stringify(watchedAuctions));
  }, [watchedAuctions]);

  useEffect(() => {
    localStorage.setItem('bidtreasure_auction_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const initializeMockAuctions = () => {
    const mockAuctions = [
      {
        id: 1,
        title: "Vintage Rolex Submariner 1965",
        currentBid: 15500,
        startingBid: 8000,
        reservePrice: 12000,
        reserveMet: true,
        bidIncrement: 250,
        buyItNowPrice: 18000,
        timeRemaining: calculateTimeRemaining(new Date(Date.now() + 2 * 60 * 60 * 1000)), 
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        bidCount: 23,
        isActive: true,
        lastBidTime: new Date(Date.now() - 30 * 60 * 1000), 
        currentWinner: 'bidder_123',
        bidHistory: [
          { bidder: 'bidder_123', amount: 15500, timestamp: new Date(Date.now() - 30 * 60 * 1000) },
          { bidder: 'bidder_456', amount: 15250, timestamp: new Date(Date.now() - 45 * 60 * 1000) }
        ]
      },
      {
        id: 2,
        title: "Apple MacBook Pro 16-inch M3 Max",
        currentBid: 2100,
        startingBid: 1500,
        reservePrice: 2000,
        reserveMet: true,
        bidIncrement: 50,
        buyItNowPrice: 2800,
        timeRemaining: calculateTimeRemaining(new Date(Date.now() + 4 * 60 * 60 * 1000)), 
        endDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
        bidCount: 34,
        isActive: true,
        lastBidTime: new Date(Date.now() - 15 * 60 * 1000), 
        currentWinner: 'current_user',
        bidHistory: [
          { bidder: 'current_user', amount: 2100, timestamp: new Date(Date.now() - 15 * 60 * 1000) },
          { bidder: 'bidder_789', amount: 2050, timestamp: new Date(Date.now() - 30 * 60 * 1000) }
        ]
      }
    ];

    setActiveAuctions(mockAuctions);
  };

  const calculateTimeRemaining = (endDate) => {
    const now = new Date();
    const difference = endDate - now;
    
    if (difference <= 0) return 'Ended';
    
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAuctions(prev => prev.map(auction => {
        const newTimeRemaining = calculateTimeRemaining(auction.endDate);
        
        
        const shouldUpdateBid = Math.random() < 0.1; 
        
        if (shouldUpdateBid && newTimeRemaining !== 'Ended' && auction.currentWinner !== 'current_user') {
          const newBid = auction.currentBid + auction.bidIncrement + Math.floor(Math.random() * 3) * auction.bidIncrement;
          const newBidder = `bidder_${Math.floor(Math.random() * 1000)}`;
          
          
          const userAutoBid = userBids.find(bid => bid.auctionId === auction.id && bid.type === 'auto');
          
          if (userAutoBid && userAutoBid.maxAmount > newBid) {
            
            const autoBidAmount = Math.min(userAutoBid.maxAmount, newBid + auction.bidIncrement);
            
            const updatedAuction = {
              ...auction,
              currentBid: autoBidAmount,
              bidCount: auction.bidCount + 2, 
              currentWinner: 'current_user',
              lastBidTime: new Date(),
              timeRemaining: newTimeRemaining,
              bidHistory: [
                { bidder: 'current_user', amount: autoBidAmount, timestamp: new Date(), isAutoBid: true },
                { bidder: newBidder, amount: newBid, timestamp: new Date(Date.now() - 1000) },
                ...auction.bidHistory
              ]
            };

            
            addNotification({
              type: 'auto_bid_placed',
              auctionId: auction.id,
              title: 'Auto-bid placed',
              message: `Your auto-bid of $${autoBidAmount.toLocaleString()} was placed for "${auction.title}"`,
              amount: autoBidAmount,
              urgent: false
            });

            return updatedAuction;
          } else {
            
            const updatedAuction = {
              ...auction,
              currentBid: newBid,
              bidCount: auction.bidCount + 1,
              currentWinner: newBidder,
              lastBidTime: new Date(),
              timeRemaining: newTimeRemaining,
              bidHistory: [
                { bidder: newBidder, amount: newBid, timestamp: new Date() },
                ...auction.bidHistory
              ]
            };

            
            if (auction.currentWinner === 'current_user') {
              addNotification({
                type: 'outbid',
                auctionId: auction.id,
                title: 'You\'ve been outbid!',
                message: `Someone bid $${newBid.toLocaleString()} on "${auction.title}"`,
                amount: newBid,
                urgent: true
              });
            }

            return updatedAuction;
          }
        }

        return {
          ...auction,
          timeRemaining: newTimeRemaining,
          isActive: newTimeRemaining !== 'Ended'
        };
      }));
    }, 3000); 

    return () => clearInterval(interval);
  }, [userBids]);

  
  const placeBid = (auctionId, bidAmount) => {
    const auction = activeAuctions.find(a => a.id === auctionId);
    if (!auction || auction.timeRemaining === 'Ended') {
      throw new Error('Auction has ended or not found');
    }

    if (bidAmount < auction.currentBid + auction.bidIncrement) {
      throw new Error(`Minimum bid is $${(auction.currentBid + auction.bidIncrement).toLocaleString()}`);
    }

    
    setActiveAuctions(prev => prev.map(a => 
      a.id === auctionId 
        ? {
            ...a,
            currentBid: bidAmount,
            bidCount: a.bidCount + 1,
            currentWinner: 'current_user',
            lastBidTime: new Date(),
            bidHistory: [
              { bidder: 'current_user', amount: bidAmount, timestamp: new Date() },
              ...a.bidHistory
            ]
          }
        : a
    ));

    
    const newBid = {
      id: Date.now(),
      auctionId,
      type: 'manual',
      amount: bidAmount,
      timestamp: new Date(),
      status: 'winning'
    };

    setUserBids(prev => {
      
      const filtered = prev.filter(bid => !(bid.auctionId === auctionId && bid.type === 'manual'));
      return [...filtered, newBid];
    });

    addNotification({
      type: 'bid_placed',
      auctionId,
      title: 'Bid placed successfully',
      message: `Your bid of $${bidAmount.toLocaleString()} was placed`,
      amount: bidAmount,
      urgent: false
    });

    return newBid;
  };

  
  const setAutoBid = (auctionId, maxAmount) => {
    const auction = activeAuctions.find(a => a.id === auctionId);
    if (!auction || auction.timeRemaining === 'Ended') {
      throw new Error('Auction has ended or not found');
    }

    if (maxAmount <= auction.currentBid) {
      throw new Error(`Maximum bid must be higher than current bid of $${auction.currentBid.toLocaleString()}`);
    }

    
    setUserBids(prev => prev.filter(bid => !(bid.auctionId === auctionId && bid.type === 'auto')));

    
    const autoBid = {
      id: Date.now(),
      auctionId,
      type: 'auto',
      maxAmount,
      currentAmount: auction.currentBid,
      timestamp: new Date(),
      status: 'active'
    };

    setUserBids(prev => [...prev, autoBid]);

    
    const nextBidAmount = auction.currentBid + auction.bidIncrement;
    if (nextBidAmount <= maxAmount && auction.currentWinner !== 'current_user') {
      placeBid(auctionId, nextBidAmount);
    }

    addNotification({
      type: 'auto_bid_set',
      auctionId,
      title: 'Auto-bid activated',
      message: `Auto-bid set up to $${maxAmount.toLocaleString()}`,
      amount: maxAmount,
      urgent: false
    });

    return autoBid;
  };

  
  const buyItNow = (auctionId) => {
    const auction = activeAuctions.find(a => a.id === auctionId);
    if (!auction || auction.timeRemaining === 'Ended') {
      throw new Error('Auction has ended or not found');
    }

    if (!auction.buyItNowPrice) {
      throw new Error('Buy It Now not available for this auction');
    }

    
    setActiveAuctions(prev => prev.map(a => 
      a.id === auctionId 
        ? {
            ...a,
            currentBid: a.buyItNowPrice,
            currentWinner: 'current_user',
            timeRemaining: 'Ended',
            isActive: false,
            endedViaBuyItNow: true,
            lastBidTime: new Date()
          }
        : a
    ));

    
    const winningBid = {
      id: Date.now(),
      auctionId,
      type: 'buy_it_now',
      amount: auction.buyItNowPrice,
      timestamp: new Date(),
      status: 'won'
    };

    setUserBids(prev => [...prev, winningBid]);

    addNotification({
      type: 'buy_it_now',
      auctionId,
      title: 'Purchase successful!',
      message: `You won "${auction.title}" for $${auction.buyItNowPrice.toLocaleString()}`,
      amount: auction.buyItNowPrice,
      urgent: false
    });

    return winningBid;
  };

  
  const toggleWatchAuction = (auctionId) => {
    const isWatched = watchedAuctions.includes(auctionId);
    
    if (isWatched) {
      setWatchedAuctions(prev => prev.filter(id => id !== auctionId));
    } else {
      setWatchedAuctions(prev => [...prev, auctionId]);
      
      const auction = activeAuctions.find(a => a.id === auctionId);
      if (auction) {
        addNotification({
          type: 'watch_added',
          auctionId,
          title: 'Added to watchlist',
          message: `"${auction.title}" added to your watchlist`,
          urgent: false
        });
      }
    }
  };

  
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      isRead: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); 
  };

  
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  
  const getAuction = (auctionId) => {
    return activeAuctions.find(auction => auction.id === parseInt(auctionId));
  };

  
  const getUserBidForAuction = (auctionId) => {
    return userBids.filter(bid => bid.auctionId === auctionId);
  };

  
  const isAuctionWatched = (auctionId) => {
    return watchedAuctions.includes(auctionId);
  };

  const value = {
    activeAuctions,
    userBids,
    notifications,
    watchedAuctions,
    placeBid,
    setAutoBid,
    buyItNow,
    toggleWatchAuction,
    getAuction,
    getUserBidForAuction,
    isAuctionWatched,
    markNotificationAsRead,
    addNotification
  };

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  );
};