import React from 'react';

interface ActionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  actions: {
    label: string;
    onClick: () => void;
    danger?: boolean;
  }[];
}

export const ActionSheet: React.FC<ActionSheetProps> = ({ isVisible, onClose, actions }) => {
  if (!isVisible) return null;

  return (
    <>
      {/* 遮罩 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
        }}
      />

      {/* 操作面板 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          borderRadius: '12px 12px 0 0',
          zIndex: 1001,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            style={{
              width: '100%',
              padding: '14px 0',
              borderBottom: index !== actions.length - 1 ? '1px solid #e5e5e5' : 'none',
              background: 'transparent',
              border: 'none',
              fontSize: '16px',
              color: action.danger ? '#fa5151' : '#000000',
              cursor: 'pointer',
            }}
          >
            {action.label}
          </button>
        ))}

        {/* 取消按钮 */}
        <button
          onClick={onClose}
          style={{
            margin: '8px 12px',
            padding: '12px 0',
            background: '#f7f7f7',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            color: '#000000',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          取消
        </button>
      </div>
    </>
  );
};

interface ConfirmDialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isVisible,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  danger = false,
}) => {
  if (!isVisible) return null;

  return (
    <>
      {/* 遮罩 */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
        }}
      />

      {/* 弹窗 */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#ffffff',
          borderRadius: '12px',
          zIndex: 1001,
          width: '280px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#000000', marginBottom: '8px' }}>
            {title}
          </div>
          <div style={{ fontSize: '14px', color: '#888888' }}>{message}</div>
        </div>

        <div style={{ display: 'flex', borderTop: '1px solid #e5e5e5' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'transparent',
              border: 'none',
              borderRight: '1px solid #e5e5e5',
              fontSize: '16px',
              color: '#000000',
              cursor: 'pointer',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'transparent',
              border: 'none',
              fontSize: '16px',
              color: danger ? '#fa5151' : '#07C160',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
};
