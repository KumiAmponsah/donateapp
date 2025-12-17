// C:\Users\cypri\Documents\donateapp\app\components\styles\admin.ts
import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const adminStyles = StyleSheet.create({
  // Modal Container
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  
  // Modal Header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: '#4A5568',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A202C',
    flex: 1,
  },
  refreshHeaderButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
  },
  refreshIcon: {
    width: 20,
    height: 20,
    tintColor: '#4A5568',
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#F7FAFC',
  },
  tabIconContainer: {
    width: 24,
    height: 24,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabIconContainer: {
    backgroundColor: '#4A5568',
    borderRadius: 6,
  },
  tabIcon: {
    width: 20,
    height: 20,
    tintColor: '#A0AEC0',
  },
  activeTabIcon: {
    tintColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A0AEC0',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#4A5568',
    fontWeight: '600',
  },
  badgeCount: {
    color: '#F56565',
    fontWeight: 'bold',
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#718096',
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flex: 1,
    minWidth: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardWide: {
    minWidth: '100%',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 20,
    height: 20,
    tintColor: '#4A5568',
    marginRight: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    width: 16,
    height: 16,
    tintColor: '#38A169',
    marginRight: 4,
  },
  trendText: {
    fontSize: 12,
    color: '#38A169',
  },
  statDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDetailLabel: {
    fontSize: 12,
    color: '#718096',
    marginRight: 4,
  },
  statDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A202C',
  },
  pendingValue: {
    color: '#ED8936',
  },
  
  // Sections
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonIcon: {
    width: 16,
    height: 16,
    tintColor: '#4A5568',
    marginRight: 6,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
  },
  
  // Quick Actions
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionIconImage: {
    width: 20,
    height: 20,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: '#718096',
  },
  chevronIcon: {
    width: 16,
    height: 16,
    tintColor: '#A0AEC0',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    width: 60,
    height: 60,
    tintColor: '#48BB78',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  
  // Approval Items
  approvalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  lastApprovalItem: {
    borderBottomWidth: 0,
  },
  approvalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  approvalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  approvalIcon: {
    width: 20,
    height: 20,
  },
  approvalContent: {
    flex: 1,
  },
  approvalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  approvalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeOrg: {
    backgroundColor: '#4299E120',
  },
  typeBadgeCampaign: {
    backgroundColor: '#48BB7820',
  },
  typeBadgeUpdate: {
    backgroundColor: '#ED893620',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
  },
  approvalOrganization: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  approvalDate: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  approvalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FED7D7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6F6D5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C53030',
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#276749',
  },
  
  // User Items
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  lastUserItem: {
    borderBottomWidth: 0,
  },
  userItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  userAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  userAvatar: {
    width: 24,
    height: 24,
    tintColor: '#4A5568',
  },
  blockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockedIcon: {
    width: 16,
    height: 16,
    tintColor: '#E53E3E',
  },
  userContent: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    flex: 1,
    marginRight: 8,
  },
  userBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  blockedBadge: {
    backgroundColor: '#FED7D7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  blockedBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#C53030',
  },
  pendingBadge: {
    backgroundColor: '#FEEBC8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D69E2E',
  },
  verifiedBadge: {
    backgroundColor: '#C6F6D5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#276749',
  },
  adminBadge: {
    backgroundColor: '#E9D8FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#553C9A',
  },
  userEmail: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
  },
  userDot: {
    fontSize: 12,
    color: '#A0AEC0',
    marginHorizontal: 4,
  },
  userDate: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  userActions: {
    flexDirection: 'row',
  },
  unblockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BEE3F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  blockUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FED7D7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  userActionIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  unblockButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B6CB0',
  },
  blockUserButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C53030',
  },
  
  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
 
  modalSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#1A202C',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F7FAFC',
  },
  modalButtonConfirm: {
    backgroundColor: '#4A5568',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
  },
  modalButtonConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
export default adminStyles;