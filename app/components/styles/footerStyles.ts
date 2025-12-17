import { StyleSheet } from 'react-native';

export const footerStyles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 15,
    zIndex: 100,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
    // Optional: Add this if you want the icons to be centered better
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
    tintColor: '#A0AEC0',
  },
  activeTabIcon: {
    tintColor: '#4A5568',
    transform: [{ scale: 1.1 }],
  },
  tabText: {
    fontSize: 11, // Slightly smaller
    color: '#A0AEC0',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A5568',
    fontWeight: 'bold',
  },
});

export default footerStyles;