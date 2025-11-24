import { StyleSheet } from 'react-native';

export const footerStyles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 0,
    paddingBottom: 39, // Extra padding for phone bottom buttons
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  tabIcon: {
    width: 24,
    height: 24,
    tintColor: '#A0AEC0',
    marginBottom: 4,
  },
  activeTabIcon: {
    tintColor: '#4A5568',
  },
  tabText: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A5568',
    fontWeight: 'bold',
  },
});

export default footerStyles;