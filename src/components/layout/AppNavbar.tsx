import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notifications } from '@/lib/mockData';
import { ethers } from 'ethers';

const AppNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    const { ethereum } = window as any;
    if (!ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
     const address = await signer.getAddress();
      setWalletAddress(address);
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  };

  
  useEffect(() => {
    const { ethereum } = window as any;
    if (!ethereum) return;
  
    ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    });
  }, []);
  

  const handleLogout = () => {
    logout();
    setWalletAddress(null); // reset wallet on logout
  };

  if (!user) return null;

  const userInitials = user.name
    .split(' ')
    .map(n => n[0])
    .join('');

  const userNotifications = notifications.filter(n => n.userId === user.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-blue-600 text-xl font-bold">MedChain</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {!walletAddress ? (
              <Button variant="outline" onClick={connectWallet} className="mr-4">
                Connect Wallet
              </Button>
            ) : (
              <span className="mr-4 text-sm font-mono">
                {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
              </span>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <h3 className="font-medium text-sm px-2 py-2 border-b">Notifications</h3>
                <div className="max-h-64 overflow-y-auto">
                  {userNotifications.length > 0 ? (
                    userNotifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="cursor-pointer p-3 border-b">
                        <div className={`${notification.read ? 'opacity-70' : 'font-medium'}`}>
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="ml-3 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <span className="mr-2 text-sm">{user.name}</span>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
