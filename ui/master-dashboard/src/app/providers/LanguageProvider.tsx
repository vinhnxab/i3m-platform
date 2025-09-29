import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 
  | 'en' | 'vi' | 'ja' | 'ko' | 'zh' | 'fr' | 'de' | 'es'
  | 'ru' | 'pt' | 'it' | 'nl' | 'sv' | 'no' | 'da' | 'fi'
  | 'pl' | 'tr' | 'ar' | 'hi' | 'th' | 'id' | 'ms' | 'tl';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  getLanguageInfo: () => {
    current: Language;
    browser: string;
    allBrowser: readonly string[];
    timezone: string;
    detected: Language | null;
  } | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Smart language detection function
function detectSystemLanguage(): Language | null {
  if (typeof window === 'undefined') return null;

  // Get browser languages in order of preference
  const browserLanguages = [
    navigator.language,
    ...(navigator.languages || [])
  ];

  // Language mapping for better detection
  const languageMap: Record<string, Language> = {
    // Direct matches
    'en': 'en', 'en-US': 'en', 'en-GB': 'en', 'en-AU': 'en', 'en-CA': 'en',
    'vi': 'vi', 'vi-VN': 'vi',
    'ja': 'ja', 'ja-JP': 'ja',
    'ko': 'ko', 'ko-KR': 'ko',
    'zh': 'zh', 'zh-CN': 'zh', 'zh-TW': 'zh', 'zh-HK': 'zh',
    'fr': 'fr', 'fr-FR': 'fr', 'fr-CA': 'fr', 'fr-BE': 'fr', 'fr-CH': 'fr',
    'de': 'de', 'de-DE': 'de', 'de-AT': 'de', 'de-CH': 'de',
    'es': 'es', 'es-ES': 'es', 'es-MX': 'es', 'es-AR': 'es', 'es-CO': 'es',
    'ru': 'ru', 'ru-RU': 'ru', 'ru-BY': 'ru', 'ru-KZ': 'ru',
    'pt': 'pt', 'pt-PT': 'pt', 'pt-BR': 'pt',
    'it': 'it', 'it-IT': 'it', 'it-CH': 'it',
    'nl': 'nl', 'nl-NL': 'nl', 'nl-BE': 'nl',
    'sv': 'sv', 'sv-SE': 'sv', 'sv-FI': 'sv',
    'no': 'no', 'nb': 'no', 'nn': 'no', 'nb-NO': 'no', 'nn-NO': 'no',
    'da': 'da', 'da-DK': 'da',
    'fi': 'fi', 'fi-FI': 'fi',
    'pl': 'pl', 'pl-PL': 'pl',
    'tr': 'tr', 'tr-TR': 'tr',
    'ar': 'ar', 'ar-SA': 'ar', 'ar-EG': 'ar', 'ar-AE': 'ar',
    'hi': 'hi', 'hi-IN': 'hi',
    'th': 'th', 'th-TH': 'th',
    'id': 'id', 'id-ID': 'id',
    'ms': 'ms', 'ms-MY': 'ms', 'ms-BN': 'ms',
    'tl': 'tl', 'fil': 'tl', 'fil-PH': 'tl'
  };

  // Try to find exact match first
  for (const browserLang of browserLanguages) {
    if (languageMap[browserLang]) {
      return languageMap[browserLang];
    }
  }

  // Try to find by language code only (fallback)
  for (const browserLang of browserLanguages) {
    const langCode = browserLang.split('-')[0].toLowerCase();
    if (languageMap[langCode]) {
      return languageMap[langCode];
    }
  }

  // Try to detect by timezone (geographic detection)
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneLanguageMap: Record<string, Language> = {
      'Asia/Ho_Chi_Minh': 'vi',
      'Asia/Tokyo': 'ja',
      'Asia/Seoul': 'ko',
      'Asia/Shanghai': 'zh',
      'Asia/Hong_Kong': 'zh',
      'Asia/Taipei': 'zh',
      'Europe/Paris': 'fr',
      'Europe/Berlin': 'de',
      'Europe/Madrid': 'es',
      'Europe/Moscow': 'ru',
      'Europe/Lisbon': 'pt',
      'Europe/Rome': 'it',
      'Europe/Amsterdam': 'nl',
      'Europe/Stockholm': 'sv',
      'Europe/Oslo': 'no',
      'Europe/Copenhagen': 'da',
      'Europe/Helsinki': 'fi',
      'Europe/Warsaw': 'pl',
      'Europe/Istanbul': 'tr',
      'Asia/Riyadh': 'ar',
      'Asia/Kolkata': 'hi',
      'Asia/Bangkok': 'th',
      'Asia/Jakarta': 'id',
      'Asia/Kuala_Lumpur': 'ms',
      'Asia/Manila': 'tl'
    };

    if (timezoneLanguageMap[timezone]) {
      return timezoneLanguageMap[timezone];
    }
  } catch (error) {
    console.warn('Error detecting timezone:', error);
  }

  // Default fallback
  return null;
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Simplified translations for core functionality
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.overview': 'Overview',
    'nav.erp': 'ERP Management',
    'nav.cms': 'CMS Management',
    'nav.ecommerce': 'E-commerce',
    'nav.support': 'Customer Support',
    'nav.templates': 'Templates',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'dashboard.welcome': 'Welcome to I3M Platform',
    'dashboard.subtitle': 'Comprehensive SaaS management system',
    'auth.signIn': 'Login',
    'auth.signUp': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.role': 'Role',
    'auth.author': 'Author',
    'auth.editor': 'Editor',
    'auth.admin': 'Admin',
    'auth.createAccount': 'Create Account',
    'auth.signingIn': 'Signing in...',
    'auth.creatingAccount': 'Creating account...',
    'auth.failedToSignIn': 'Failed to sign in',
    'auth.failedToSignUp': 'Failed to create account',
    'auth.demoCredentials': 'Demo credentials: admin@i3m.com / admin123',
    'auth.rememberMe': 'Remember me',
    'auth.emailPlaceholder': 'Enter your email address',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.fullNamePlaceholder': 'Enter your full name',
    'auth.confirmPasswordPlaceholder': 'Confirm your password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.agreeToTerms': 'I agree to the terms and conditions',
    'auth.welcomeBack': 'Welcome Back',
    'auth.enterCredentials': 'Enter your credentials to access the platform',
    'auth.joinPlatform': 'Join the I3M Platform and get started',
    'auth.secureAccess': 'Secure access to your I3M Platform account',
    'auth.forgotPasswordTitle': 'Forgot Password?',
    'auth.forgotPasswordDescription': 'Enter your email address and we\'ll send you a link to reset your password',
    'auth.sendResetLink': 'Send Reset Link',
    'auth.checkYourEmail': 'Check Your Email',
    'auth.resetLinkSent': 'We\'ve sent a password reset link to',
    'auth.didntReceiveEmail': 'Didn\'t receive the email? Check your spam folder or try again.',
    'auth.backToSignIn': 'Back to Login',
    'auth.tryAnotherEmail': 'Try Another Email',
  },
  vi: {
    'nav.overview': 'Tổng quan',
    'nav.erp': 'Quản lý ERP',
    'nav.cms': 'Quản lý CMS',
    'nav.ecommerce': 'Thương mại điện tử',
    'nav.support': 'Hỗ trợ khách hàng',
    'nav.templates': 'Mẫu thiết kế',
    'nav.analytics': 'Phân tích',
    'nav.settings': 'Cài đặt',
    'common.loading': 'Đang tải...',
    'common.save': 'Lưu',
    'common.edit': 'Chỉnh sửa',
    'common.delete': 'Xóa',
    'dashboard.welcome': 'Chào mừng đến với I3M Platform',
    'dashboard.subtitle': 'Hệ thống quản lý SaaS toàn diện',
    'auth.signIn': 'Đăng nhập',
    'auth.signUp': 'Đăng ký',
    'auth.email': 'Email',
    'auth.password': 'Mật khẩu',
    'auth.fullName': 'Họ và tên',
    'auth.confirmPassword': 'Xác nhận mật khẩu',
    'auth.role': 'Vai trò',
    'auth.author': 'Tác giả',
    'auth.editor': 'Biên tập viên',
    'auth.admin': 'Quản trị viên',
    'auth.createAccount': 'Tạo tài khoản',
    'auth.signingIn': 'Đang đăng nhập...',
    'auth.creatingAccount': 'Đang tạo tài khoản...',
    'auth.failedToSignIn': 'Đăng nhập thất bại',
    'auth.failedToSignUp': 'Tạo tài khoản thất bại',
    'auth.demoCredentials': 'Thông tin demo: admin@i3m.com / admin123',
    'auth.rememberMe': 'Ghi nhớ đăng nhập',
    'auth.emailPlaceholder': 'Nhập địa chỉ email của bạn',
    'auth.passwordPlaceholder': 'Nhập mật khẩu của bạn',
    'auth.fullNamePlaceholder': 'Nhập họ và tên của bạn',
    'auth.confirmPasswordPlaceholder': 'Xác nhận mật khẩu của bạn',
    'auth.forgotPassword': 'Quên mật khẩu?',
    'auth.agreeToTerms': 'Tôi đồng ý với các điều khoản và điều kiện',
    'auth.welcomeBack': 'Chào mừng trở lại',
    'auth.enterCredentials': 'Nhập thông tin đăng nhập để truy cập nền tảng',
    'auth.joinPlatform': 'Tham gia nền tảng I3M và bắt đầu',
    'auth.secureAccess': 'Truy cập an toàn vào tài khoản nền tảng I3M của bạn',
    'auth.forgotPasswordTitle': 'Quên mật khẩu?',
    'auth.forgotPasswordDescription': 'Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu',
    'auth.sendResetLink': 'Gửi liên kết đặt lại',
    'auth.checkYourEmail': 'Kiểm tra email của bạn',
    'auth.resetLinkSent': 'Chúng tôi đã gửi liên kết đặt lại mật khẩu đến',
    'auth.didntReceiveEmail': 'Không nhận được email? Kiểm tra thư mục spam hoặc thử lại.',
    'auth.backToSignIn': 'Quay lại đăng nhập',
    'auth.tryAnotherEmail': 'Thử email khác',
  },
  // Add more languages as needed...
  ja: { 
    'nav.overview': '概要', 'nav.erp': 'ERP管理', 'nav.cms': 'CMS管理', 'nav.ecommerce': 'Eコマース', 'nav.support': 'カスタマーサポート', 'nav.templates': 'テンプレート', 'nav.analytics': '分析', 'nav.settings': '設定', 
    'common.loading': '読み込み中...', 'common.save': '保存', 'common.edit': '編集', 'common.delete': '削除', 
    'dashboard.welcome': 'I3Mプラットフォームへようこそ', 'dashboard.subtitle': '包括的なSaaS管理システム',
    'auth.signIn': 'ログイン', 'auth.signUp': '登録', 'auth.email': 'メールアドレス', 'auth.password': 'パスワード', 'auth.fullName': '氏名', 'auth.confirmPassword': 'パスワード確認', 'auth.role': '役割', 'auth.author': '作成者', 'auth.editor': '編集者', 'auth.admin': '管理者', 'auth.createAccount': 'アカウント作成', 'auth.signingIn': 'サインイン中...', 'auth.creatingAccount': 'アカウント作成中...', 'auth.failedToSignIn': 'サインインに失敗しました', 'auth.failedToSignUp': 'アカウント作成に失敗しました', 'auth.demoCredentials': 'デモ認証情報: admin@i3m.com / admin123', 'auth.rememberMe': 'ログイン状態を保持', 'auth.emailPlaceholder': 'メールアドレスを入力してください', 'auth.passwordPlaceholder': 'パスワードを入力してください', 'auth.fullNamePlaceholder': '氏名を入力してください', 'auth.confirmPasswordPlaceholder': 'パスワードを確認してください', 'auth.forgotPassword': 'パスワードをお忘れですか？', 'auth.agreeToTerms': '利用規約に同意します', 'auth.welcomeBack': 'おかえりなさい', 'auth.enterCredentials': 'プラットフォームにアクセスするための認証情報を入力してください', 'auth.joinPlatform': 'I3Mプラットフォームに参加して始めましょう', 'auth.secureAccess': 'I3Mプラットフォームアカウントへの安全なアクセス', 'auth.forgotPasswordTitle': 'パスワードをお忘れですか？', 'auth.forgotPasswordDescription': 'メールアドレスを入力すると、パスワードリセット用のリンクをお送りします', 'auth.sendResetLink': 'リセットリンクを送信', 'auth.checkYourEmail': 'メールを確認してください', 'auth.resetLinkSent': 'パスワードリセットリンクを送信しました', 'auth.didntReceiveEmail': 'メールが届かない場合は、スパムフォルダを確認するか、再度お試しください', 'auth.backToSignIn': 'サインインに戻る', 'auth.tryAnotherEmail': '別のメールアドレスを試す'
  },
  ko: { 
    'nav.overview': '개요', 'nav.erp': 'ERP 관리', 'nav.cms': 'CMS 관리', 'nav.ecommerce': '이커머스', 'nav.support': '고객 지원', 'nav.templates': '템플릿', 'nav.analytics': '분석', 'nav.settings': '설정', 
    'common.loading': '로딩 중...', 'common.save': '저장', 'common.edit': '편집', 'common.delete': '삭제', 
    'dashboard.welcome': 'I3M 플랫폼에 오신 것을 환영합니다', 'dashboard.subtitle': '포괄적인 SaaS 관리 시스템',
    'auth.signIn': '로그인', 'auth.signUp': '회원가입', 'auth.email': '이메일', 'auth.password': '비밀번호', 'auth.fullName': '성명', 'auth.confirmPassword': '비밀번호 확인', 'auth.role': '역할', 'auth.author': '작성자', 'auth.editor': '편집자', 'auth.admin': '관리자', 'auth.createAccount': '계정 생성', 'auth.signingIn': '로그인 중...', 'auth.creatingAccount': '계정 생성 중...', 'auth.failedToSignIn': '로그인에 실패했습니다', 'auth.failedToSignUp': '계정 생성에 실패했습니다', 'auth.demoCredentials': '데모 인증 정보: admin@i3m.com / admin123', 'auth.rememberMe': '로그인 상태 유지', 'auth.emailPlaceholder': '이메일 주소를 입력하세요', 'auth.passwordPlaceholder': '비밀번호를 입력하세요', 'auth.fullNamePlaceholder': '성명을 입력하세요', 'auth.confirmPasswordPlaceholder': '비밀번호를 확인하세요', 'auth.forgotPassword': '비밀번호를 잊으셨나요?', 'auth.agreeToTerms': '이용약관에 동의합니다', 'auth.welcomeBack': '다시 오신 것을 환영합니다', 'auth.enterCredentials': '플랫폼에 액세스하려면 인증 정보를 입력하세요', 'auth.joinPlatform': 'I3M 플랫폼에 가입하고 시작하세요', 'auth.secureAccess': 'I3M 플랫폼 계정에 대한 안전한 액세스', 'auth.forgotPasswordTitle': '비밀번호를 잊으셨나요?', 'auth.forgotPasswordDescription': '이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다', 'auth.sendResetLink': '재설정 링크 보내기', 'auth.checkYourEmail': '이메일을 확인하세요', 'auth.resetLinkSent': '비밀번호 재설정 링크를 보냈습니다', 'auth.didntReceiveEmail': '이메일을 받지 못하셨나요? 스팸 폴더를 확인하거나 다시 시도해보세요', 'auth.backToSignIn': '로그인으로 돌아가기', 'auth.tryAnotherEmail': '다른 이메일 시도'
  },
  zh: { 
    'nav.overview': '概览', 'nav.erp': 'ERP管理', 'nav.cms': 'CMS管理', 'nav.ecommerce': '电子商务', 'nav.support': '客户支持', 'nav.templates': '模板', 'nav.analytics': '分析', 'nav.settings': '设置', 
    'common.loading': '加载中...', 'common.save': '保存', 'common.edit': '编辑', 'common.delete': '删除', 
    'dashboard.welcome': '欢迎使用I3M平台', 'dashboard.subtitle': '综合SaaS管理系统',
    'auth.signIn': '登录', 'auth.signUp': '注册', 'auth.email': '邮箱', 'auth.password': '密码', 'auth.fullName': '姓名', 'auth.confirmPassword': '确认密码', 'auth.role': '角色', 'auth.author': '作者', 'auth.editor': '编辑', 'auth.admin': '管理员', 'auth.createAccount': '创建账户', 'auth.signingIn': '登录中...', 'auth.creatingAccount': '创建账户中...', 'auth.failedToSignIn': '登录失败', 'auth.failedToSignUp': '创建账户失败', 'auth.demoCredentials': '演示凭据: admin@i3m.com / admin123', 'auth.rememberMe': '记住我', 'auth.emailPlaceholder': '请输入邮箱地址', 'auth.passwordPlaceholder': '请输入密码', 'auth.fullNamePlaceholder': '请输入姓名', 'auth.confirmPasswordPlaceholder': '请确认密码', 'auth.forgotPassword': '忘记密码？', 'auth.agreeToTerms': '我同意条款和条件', 'auth.welcomeBack': '欢迎回来', 'auth.enterCredentials': '输入您的凭据以访问平台', 'auth.joinPlatform': '加入I3M平台并开始使用', 'auth.secureAccess': '安全访问您的I3M平台账户', 'auth.forgotPasswordTitle': '忘记密码？', 'auth.forgotPasswordDescription': '输入您的邮箱地址，我们将发送密码重置链接', 'auth.sendResetLink': '发送重置链接', 'auth.checkYourEmail': '检查您的邮箱', 'auth.resetLinkSent': '我们已发送密码重置链接到', 'auth.didntReceiveEmail': '没有收到邮件？请检查垃圾邮件文件夹或重试', 'auth.backToSignIn': '返回登录', 'auth.tryAnotherEmail': '尝试其他邮箱'
  },
  fr: { 
    'nav.overview': 'Aperçu', 'nav.erp': 'Gestion ERP', 'nav.cms': 'Gestion CMS', 'nav.ecommerce': 'E-commerce', 'nav.support': 'Support client', 'nav.templates': 'Modèles', 'nav.analytics': 'Analytiques', 'nav.settings': 'Paramètres', 
    'common.loading': 'Chargement...', 'common.save': 'Enregistrer', 'common.edit': 'Modifier', 'common.delete': 'Supprimer', 
    'dashboard.welcome': 'Bienvenue sur la plateforme I3M', 'dashboard.subtitle': 'Système de gestion SaaS complet',
    'auth.signIn': 'Connexion', 'auth.signUp': 'S\'inscrire', 'auth.email': 'E-mail', 'auth.password': 'Mot de passe', 'auth.fullName': 'Nom complet', 'auth.confirmPassword': 'Confirmer le mot de passe', 'auth.role': 'Rôle', 'auth.author': 'Auteur', 'auth.editor': 'Éditeur', 'auth.admin': 'Administrateur', 'auth.createAccount': 'Créer un compte', 'auth.signingIn': 'Connexion en cours...', 'auth.creatingAccount': 'Création du compte...', 'auth.failedToSignIn': 'Échec de la connexion', 'auth.failedToSignUp': 'Échec de la création du compte', 'auth.demoCredentials': 'Identifiants de démonstration: admin@i3m.com / admin123', 'auth.rememberMe': 'Se souvenir de moi', 'auth.emailPlaceholder': 'Entrez votre adresse e-mail', 'auth.passwordPlaceholder': 'Entrez votre mot de passe', 'auth.fullNamePlaceholder': 'Entrez votre nom complet', 'auth.confirmPasswordPlaceholder': 'Confirmez votre mot de passe', 'auth.forgotPassword': 'Mot de passe oublié ?', 'auth.agreeToTerms': 'J\'accepte les termes et conditions', 'auth.welcomeBack': 'Bon retour', 'auth.enterCredentials': 'Entrez vos identifiants pour accéder à la plateforme', 'auth.joinPlatform': 'Rejoignez la plateforme I3M et commencez', 'auth.secureAccess': 'Accès sécurisé à votre compte plateforme I3M', 'auth.forgotPasswordTitle': 'Mot de passe oublié ?', 'auth.forgotPasswordDescription': 'Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe', 'auth.sendResetLink': 'Envoyer le lien de réinitialisation', 'auth.checkYourEmail': 'Vérifiez votre e-mail', 'auth.resetLinkSent': 'Nous avons envoyé un lien de réinitialisation de mot de passe à', 'auth.didntReceiveEmail': 'Vous n\'avez pas reçu l\'e-mail ? Vérifiez votre dossier spam ou réessayez', 'auth.backToSignIn': 'Retour à la connexion', 'auth.tryAnotherEmail': 'Essayer un autre e-mail'
  },
  de: { 
    'nav.overview': 'Übersicht', 'nav.erp': 'ERP-Verwaltung', 'nav.cms': 'CMS-Verwaltung', 'nav.ecommerce': 'E-Commerce', 'nav.support': 'Kundensupport', 'nav.templates': 'Vorlagen', 'nav.analytics': 'Analytik', 'nav.settings': 'Einstellungen', 
    'common.loading': 'Wird geladen...', 'common.save': 'Speichern', 'common.edit': 'Bearbeiten', 'common.delete': 'Löschen', 
    'dashboard.welcome': 'Willkommen bei der I3M-Plattform', 'dashboard.subtitle': 'Umfassendes SaaS-Verwaltungssystem',
    'auth.signIn': 'Anmelden', 'auth.signUp': 'Registrieren', 'auth.email': 'E-Mail', 'auth.password': 'Passwort', 'auth.fullName': 'Vollständiger Name', 'auth.confirmPassword': 'Passwort bestätigen', 'auth.role': 'Rolle', 'auth.author': 'Autor', 'auth.editor': 'Editor', 'auth.admin': 'Administrator', 'auth.createAccount': 'Konto erstellen', 'auth.signingIn': 'Anmeldung läuft...', 'auth.creatingAccount': 'Konto wird erstellt...', 'auth.failedToSignIn': 'Anmeldung fehlgeschlagen', 'auth.failedToSignUp': 'Kontoerstellung fehlgeschlagen', 'auth.demoCredentials': 'Demo-Anmeldedaten: admin@i3m.com / admin123', 'auth.rememberMe': 'Angemeldet bleiben', 'auth.emailPlaceholder': 'Geben Sie Ihre E-Mail-Adresse ein', 'auth.passwordPlaceholder': 'Geben Sie Ihr Passwort ein', 'auth.fullNamePlaceholder': 'Geben Sie Ihren vollständigen Namen ein', 'auth.confirmPasswordPlaceholder': 'Bestätigen Sie Ihr Passwort', 'auth.forgotPassword': 'Passwort vergessen?', 'auth.agreeToTerms': 'Ich stimme den Geschäftsbedingungen zu', 'auth.welcomeBack': 'Willkommen zurück', 'auth.enterCredentials': 'Geben Sie Ihre Anmeldedaten ein, um auf die Plattform zuzugreifen', 'auth.joinPlatform': 'Treten Sie der I3M-Plattform bei und beginnen Sie', 'auth.secureAccess': 'Sicherer Zugang zu Ihrem I3M-Plattform-Konto', 'auth.forgotPasswordTitle': 'Passwort vergessen?', 'auth.forgotPasswordDescription': 'Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts', 'auth.sendResetLink': 'Zurücksetzungslink senden', 'auth.checkYourEmail': 'Überprüfen Sie Ihre E-Mails', 'auth.resetLinkSent': 'Wir haben einen Passwort-Zurücksetzungslink an gesendet', 'auth.didntReceiveEmail': 'E-Mail nicht erhalten? Überprüfen Sie Ihren Spam-Ordner oder versuchen Sie es erneut', 'auth.backToSignIn': 'Zurück zur Anmeldung', 'auth.tryAnotherEmail': 'Andere E-Mail versuchen'
  },
  es: { 
    'nav.overview': 'Resumen', 'nav.erp': 'Gestión ERP', 'nav.cms': 'Gestión CMS', 'nav.ecommerce': 'Comercio electrónico', 'nav.support': 'Soporte al cliente', 'nav.templates': 'Plantillas', 'nav.analytics': 'Analíticas', 'nav.settings': 'Configuración', 
    'common.loading': 'Cargando...', 'common.save': 'Guardar', 'common.edit': 'Editar', 'common.delete': 'Eliminar', 
    'dashboard.welcome': 'Bienvenido a la plataforma I3M', 'dashboard.subtitle': 'Sistema integral de gestión SaaS',
    'auth.signIn': 'Iniciar sesión', 'auth.signUp': 'Registrarse', 'auth.email': 'Correo electrónico', 'auth.password': 'Contraseña', 'auth.fullName': 'Nombre completo', 'auth.confirmPassword': 'Confirmar contraseña', 'auth.role': 'Rol', 'auth.author': 'Autor', 'auth.editor': 'Editor', 'auth.admin': 'Administrador', 'auth.createAccount': 'Crear cuenta', 'auth.signingIn': 'Iniciando sesión...', 'auth.creatingAccount': 'Creando cuenta...', 'auth.failedToSignIn': 'Error al iniciar sesión', 'auth.failedToSignUp': 'Error al crear cuenta', 'auth.demoCredentials': 'Credenciales de demostración: admin@i3m.com / admin123', 'auth.rememberMe': 'Recordarme', 'auth.emailPlaceholder': 'Ingrese su dirección de correo electrónico', 'auth.passwordPlaceholder': 'Ingrese su contraseña', 'auth.fullNamePlaceholder': 'Ingrese su nombre completo', 'auth.confirmPasswordPlaceholder': 'Confirme su contraseña', 'auth.forgotPassword': '¿Olvidó su contraseña?', 'auth.agreeToTerms': 'Acepto los términos y condiciones', 'auth.welcomeBack': 'Bienvenido de nuevo', 'auth.enterCredentials': 'Ingrese sus credenciales para acceder a la plataforma', 'auth.joinPlatform': 'Únase a la plataforma I3M y comience', 'auth.secureAccess': 'Acceso seguro a su cuenta de la plataforma I3M', 'auth.forgotPasswordTitle': '¿Olvidó su contraseña?', 'auth.forgotPasswordDescription': 'Ingrese su dirección de correo electrónico y le enviaremos un enlace para restablecer su contraseña', 'auth.sendResetLink': 'Enviar enlace de restablecimiento', 'auth.checkYourEmail': 'Revise su correo electrónico', 'auth.resetLinkSent': 'Hemos enviado un enlace de restablecimiento de contraseña a', 'auth.didntReceiveEmail': '¿No recibió el correo? Revise su carpeta de spam o intente de nuevo', 'auth.backToSignIn': 'Volver al inicio de sesión', 'auth.tryAnotherEmail': 'Probar otro correo electrónico'
  },
  ru: { 
    'nav.overview': 'Обзор', 'nav.erp': 'Управление ERP', 'nav.cms': 'Управление CMS', 'nav.ecommerce': 'Электронная коммерция', 'nav.support': 'Поддержка клиентов', 'nav.templates': 'Шаблоны', 'nav.analytics': 'Аналитика', 'nav.settings': 'Настройки', 
    'common.loading': 'Загрузка...', 'common.save': 'Сохранить', 'common.edit': 'Редактировать', 'common.delete': 'Удалить', 
    'dashboard.welcome': 'Добро пожаловать в платформу I3M', 'dashboard.subtitle': 'Комплексная система управления SaaS',
    'auth.signIn': 'Войти', 'auth.signUp': 'Зарегистрироваться', 'auth.email': 'Электронная почта', 'auth.password': 'Пароль', 'auth.fullName': 'Полное имя', 'auth.confirmPassword': 'Подтвердить пароль', 'auth.role': 'Роль', 'auth.author': 'Автор', 'auth.editor': 'Редактор', 'auth.admin': 'Администратор', 'auth.createAccount': 'Создать аккаунт', 'auth.signingIn': 'Вход в систему...', 'auth.creatingAccount': 'Создание аккаунта...', 'auth.failedToSignIn': 'Ошибка входа', 'auth.failedToSignUp': 'Ошибка создания аккаунта', 'auth.demoCredentials': 'Демо-учетные данные: admin@i3m.com / admin123', 'auth.rememberMe': 'Запомнить меня', 'auth.emailPlaceholder': 'Введите ваш адрес электронной почты', 'auth.passwordPlaceholder': 'Введите ваш пароль', 'auth.fullNamePlaceholder': 'Введите ваше полное имя', 'auth.confirmPasswordPlaceholder': 'Подтвердите ваш пароль', 'auth.forgotPassword': 'Забыли пароль?', 'auth.agreeToTerms': 'Я согласен с условиями использования', 'auth.welcomeBack': 'Добро пожаловать обратно', 'auth.enterCredentials': 'Введите ваши учетные данные для доступа к платформе', 'auth.joinPlatform': 'Присоединяйтесь к платформе I3M и начните', 'auth.secureAccess': 'Безопасный доступ к вашему аккаунту платформы I3M', 'auth.forgotPasswordTitle': 'Забыли пароль?', 'auth.forgotPasswordDescription': 'Введите ваш адрес электронной почты, и мы отправим вам ссылку для сброса пароля', 'auth.sendResetLink': 'Отправить ссылку для сброса', 'auth.checkYourEmail': 'Проверьте вашу электронную почту', 'auth.resetLinkSent': 'Мы отправили ссылку для сброса пароля на', 'auth.didntReceiveEmail': 'Не получили письмо? Проверьте папку спам или попробуйте снова', 'auth.backToSignIn': 'Вернуться к входу', 'auth.tryAnotherEmail': 'Попробовать другой email'
  },
  pt: { 
    'nav.overview': 'Visão geral', 'nav.erp': 'Gestão ERP', 'nav.cms': 'Gestão CMS', 'nav.ecommerce': 'Comércio eletrônico', 'nav.support': 'Suporte ao cliente', 'nav.templates': 'Modelos', 'nav.analytics': 'Análises', 'nav.settings': 'Configurações', 
    'common.loading': 'Carregando...', 'common.save': 'Salvar', 'common.edit': 'Editar', 'common.delete': 'Excluir', 
    'dashboard.welcome': 'Bem-vindo à plataforma I3M', 'dashboard.subtitle': 'Sistema abrangente de gestão SaaS',
    'auth.signIn': 'Entrar', 'auth.signUp': 'Registrar', 'auth.email': 'E-mail', 'auth.password': 'Senha', 'auth.fullName': 'Nome completo', 'auth.confirmPassword': 'Confirmar senha', 'auth.role': 'Função', 'auth.author': 'Autor', 'auth.editor': 'Editor', 'auth.admin': 'Administrador', 'auth.createAccount': 'Criar conta', 'auth.signingIn': 'Entrando...', 'auth.creatingAccount': 'Criando conta...', 'auth.failedToSignIn': 'Falha ao entrar', 'auth.failedToSignUp': 'Falha ao criar conta', 'auth.demoCredentials': 'Credenciais de demonstração: admin@i3m.com / admin123', 'auth.rememberMe': 'Lembrar de mim', 'auth.emailPlaceholder': 'Digite seu endereço de e-mail', 'auth.passwordPlaceholder': 'Digite sua senha', 'auth.fullNamePlaceholder': 'Digite seu nome completo', 'auth.confirmPasswordPlaceholder': 'Confirme sua senha', 'auth.forgotPassword': 'Esqueceu a senha?', 'auth.agreeToTerms': 'Concordo com os termos e condições', 'auth.welcomeBack': 'Bem-vindo de volta', 'auth.enterCredentials': 'Digite suas credenciais para acessar a plataforma', 'auth.joinPlatform': 'Junte-se à plataforma I3M e comece', 'auth.secureAccess': 'Acesso seguro à sua conta da plataforma I3M', 'auth.forgotPasswordTitle': 'Esqueceu a senha?', 'auth.forgotPasswordDescription': 'Digite seu endereço de e-mail e enviaremos um link para redefinir sua senha', 'auth.sendResetLink': 'Enviar link de redefinição', 'auth.checkYourEmail': 'Verifique seu e-mail', 'auth.resetLinkSent': 'Enviamos um link de redefinição de senha para', 'auth.didntReceiveEmail': 'Não recebeu o e-mail? Verifique sua pasta de spam ou tente novamente', 'auth.backToSignIn': 'Voltar ao login', 'auth.tryAnotherEmail': 'Tentar outro e-mail'
  },
  it: { 
    'nav.overview': 'Panoramica', 'nav.erp': 'Gestione ERP', 'nav.cms': 'Gestione CMS', 'nav.ecommerce': 'E-commerce', 'nav.support': 'Supporto clienti', 'nav.templates': 'Modelli', 'nav.analytics': 'Analisi', 'nav.settings': 'Impostazioni', 
    'common.loading': 'Caricamento...', 'common.save': 'Salva', 'common.edit': 'Modifica', 'common.delete': 'Elimina', 
    'dashboard.welcome': 'Benvenuto nella piattaforma I3M', 'dashboard.subtitle': 'Sistema completo di gestione SaaS',
    'auth.signIn': 'Accedi', 'auth.signUp': 'Registrati', 'auth.email': 'E-mail', 'auth.password': 'Password', 'auth.fullName': 'Nome completo', 'auth.confirmPassword': 'Conferma password', 'auth.role': 'Ruolo', 'auth.author': 'Autore', 'auth.editor': 'Editor', 'auth.admin': 'Amministratore', 'auth.createAccount': 'Crea account', 'auth.signingIn': 'Accesso in corso...', 'auth.creatingAccount': 'Creazione account...', 'auth.failedToSignIn': 'Accesso fallito', 'auth.failedToSignUp': 'Creazione account fallita', 'auth.demoCredentials': 'Credenziali demo: admin@i3m.com / admin123', 'auth.rememberMe': 'Ricordami', 'auth.emailPlaceholder': 'Inserisci il tuo indirizzo e-mail', 'auth.passwordPlaceholder': 'Inserisci la tua password', 'auth.fullNamePlaceholder': 'Inserisci il tuo nome completo', 'auth.confirmPasswordPlaceholder': 'Conferma la tua password', 'auth.forgotPassword': 'Password dimenticata?', 'auth.agreeToTerms': 'Accetto i termini e le condizioni', 'auth.welcomeBack': 'Bentornato', 'auth.enterCredentials': 'Inserisci le tue credenziali per accedere alla piattaforma', 'auth.joinPlatform': 'Unisciti alla piattaforma I3M e inizia', 'auth.secureAccess': 'Accesso sicuro al tuo account della piattaforma I3M', 'auth.forgotPasswordTitle': 'Password dimenticata?', 'auth.forgotPasswordDescription': 'Inserisci il tuo indirizzo e-mail e ti invieremo un link per reimpostare la password', 'auth.sendResetLink': 'Invia link di reimpostazione', 'auth.checkYourEmail': 'Controlla la tua e-mail', 'auth.resetLinkSent': 'Abbiamo inviato un link di reimpostazione password a', 'auth.didntReceiveEmail': 'Non hai ricevuto l\'e-mail? Controlla la cartella spam o riprova', 'auth.backToSignIn': 'Torna all\'accesso', 'auth.tryAnotherEmail': 'Prova un\'altra e-mail'
  },
  nl: { 
    'nav.overview': 'Overzicht', 'nav.erp': 'ERP-beheer', 'nav.cms': 'CMS-beheer', 'nav.ecommerce': 'E-commerce', 'nav.support': 'Klantenondersteuning', 'nav.templates': 'Sjablonen', 'nav.analytics': 'Analyses', 'nav.settings': 'Instellingen', 
    'common.loading': 'Laden...', 'common.save': 'Opslaan', 'common.edit': 'Bewerken', 'common.delete': 'Verwijderen', 
    'dashboard.welcome': 'Welkom bij het I3M-platform', 'dashboard.subtitle': 'Uitgebreid SaaS-beheersysteem',
    'auth.signIn': 'Inloggen', 'auth.signUp': 'Registreren', 'auth.email': 'E-mail', 'auth.password': 'Wachtwoord', 'auth.fullName': 'Volledige naam', 'auth.confirmPassword': 'Bevestig wachtwoord', 'auth.role': 'Rol', 'auth.author': 'Auteur', 'auth.editor': 'Editor', 'auth.admin': 'Beheerder', 'auth.createAccount': 'Account aanmaken', 'auth.signingIn': 'Inloggen...', 'auth.creatingAccount': 'Account aanmaken...', 'auth.failedToSignIn': 'Inloggen mislukt', 'auth.failedToSignUp': 'Account aanmaken mislukt', 'auth.demoCredentials': 'Demo-inloggegevens: admin@i3m.com / admin123', 'auth.rememberMe': 'Onthoud mij', 'auth.emailPlaceholder': 'Voer uw e-mailadres in', 'auth.passwordPlaceholder': 'Voer uw wachtwoord in', 'auth.fullNamePlaceholder': 'Voer uw volledige naam in', 'auth.confirmPasswordPlaceholder': 'Bevestig uw wachtwoord', 'auth.forgotPassword': 'Wachtwoord vergeten?', 'auth.agreeToTerms': 'Ik ga akkoord met de voorwaarden', 'auth.welcomeBack': 'Welkom terug', 'auth.enterCredentials': 'Voer uw inloggegevens in om toegang te krijgen tot het platform', 'auth.joinPlatform': 'Word lid van het I3M-platform en begin', 'auth.secureAccess': 'Veilige toegang tot uw I3M-platformaccount', 'auth.forgotPasswordTitle': 'Wachtwoord vergeten?', 'auth.forgotPasswordDescription': 'Voer uw e-mailadres in en wij sturen u een link om uw wachtwoord te resetten', 'auth.sendResetLink': 'Resetlink verzenden', 'auth.checkYourEmail': 'Controleer uw e-mail', 'auth.resetLinkSent': 'We hebben een wachtwoord-resetlink verzonden naar', 'auth.didntReceiveEmail': 'Geen e-mail ontvangen? Controleer uw spam-map of probeer opnieuw', 'auth.backToSignIn': 'Terug naar inloggen', 'auth.tryAnotherEmail': 'Probeer een ander e-mailadres'
  },
  sv: { 
    'nav.overview': 'Översikt', 'nav.erp': 'ERP-hantering', 'nav.cms': 'CMS-hantering', 'nav.ecommerce': 'E-handel', 'nav.support': 'Kundsupport', 'nav.templates': 'Mallar', 'nav.analytics': 'Analys', 'nav.settings': 'Inställningar', 
    'common.loading': 'Laddar...', 'common.save': 'Spara', 'common.edit': 'Redigera', 'common.delete': 'Ta bort', 
    'dashboard.welcome': 'Välkommen till I3M-plattformen', 'dashboard.subtitle': 'Omfattande SaaS-hanteringssystem',
    'auth.signIn': 'Logga in', 'auth.signUp': 'Registrera', 'auth.email': 'E-post', 'auth.password': 'Lösenord', 'auth.fullName': 'Fullständigt namn', 'auth.confirmPassword': 'Bekräfta lösenord', 'auth.role': 'Roll', 'auth.author': 'Författare', 'auth.editor': 'Redaktör', 'auth.admin': 'Administratör', 'auth.createAccount': 'Skapa konto', 'auth.signingIn': 'Loggar in...', 'auth.creatingAccount': 'Skapar konto...', 'auth.failedToSignIn': 'Inloggning misslyckades', 'auth.failedToSignUp': 'Kontoskapande misslyckades', 'auth.demoCredentials': 'Demo-inloggningsuppgifter: admin@i3m.com / admin123', 'auth.rememberMe': 'Kom ihåg mig', 'auth.emailPlaceholder': 'Ange din e-postadress', 'auth.passwordPlaceholder': 'Ange ditt lösenord', 'auth.fullNamePlaceholder': 'Ange ditt fullständiga namn', 'auth.confirmPasswordPlaceholder': 'Bekräfta ditt lösenord', 'auth.forgotPassword': 'Glömt lösenord?', 'auth.agreeToTerms': 'Jag godkänner villkoren', 'auth.welcomeBack': 'Välkommen tillbaka', 'auth.enterCredentials': 'Ange dina inloggningsuppgifter för att komma åt plattformen', 'auth.joinPlatform': 'Gå med i I3M-plattformen och börja', 'auth.secureAccess': 'Säker åtkomst till ditt I3M-plattformskonto', 'auth.forgotPasswordTitle': 'Glömt lösenord?', 'auth.forgotPasswordDescription': 'Ange din e-postadress så skickar vi en länk för att återställa ditt lösenord', 'auth.sendResetLink': 'Skicka återställningslänk', 'auth.checkYourEmail': 'Kontrollera din e-post', 'auth.resetLinkSent': 'Vi har skickat en lösenordsåterställningslänk till', 'auth.didntReceiveEmail': 'Fick du inte e-postmeddelandet? Kontrollera din skräppost eller försök igen', 'auth.backToSignIn': 'Tillbaka till inloggning', 'auth.tryAnotherEmail': 'Prova en annan e-post'
  },
  no: { 
    'nav.overview': 'Oversikt', 'nav.erp': 'ERP-styring', 'nav.cms': 'CMS-styring', 'nav.ecommerce': 'E-handel', 'nav.support': 'Kundestøtte', 'nav.templates': 'Maler', 'nav.analytics': 'Analyse', 'nav.settings': 'Innstillinger', 
    'common.loading': 'Laster...', 'common.save': 'Lagre', 'common.edit': 'Rediger', 'common.delete': 'Slett', 
    'dashboard.welcome': 'Velkommen til I3M-plattformen', 'dashboard.subtitle': 'Omfattende SaaS-styringssystem',
    'auth.signIn': 'Logg inn', 'auth.signUp': 'Registrer', 'auth.email': 'E-post', 'auth.password': 'Passord', 'auth.fullName': 'Fullt navn', 'auth.confirmPassword': 'Bekreft passord', 'auth.role': 'Rolle', 'auth.author': 'Forfatter', 'auth.editor': 'Redaktør', 'auth.admin': 'Administrator', 'auth.createAccount': 'Opprett konto', 'auth.signingIn': 'Logger inn...', 'auth.creatingAccount': 'Oppretter konto...', 'auth.failedToSignIn': 'Innlogging mislyktes', 'auth.failedToSignUp': 'Kontooppretting mislyktes', 'auth.demoCredentials': 'Demo-påloggingsdata: admin@i3m.com / admin123', 'auth.rememberMe': 'Husk meg', 'auth.emailPlaceholder': 'Skriv inn din e-postadresse', 'auth.passwordPlaceholder': 'Skriv inn ditt passord', 'auth.fullNamePlaceholder': 'Skriv inn ditt fulle navn', 'auth.confirmPasswordPlaceholder': 'Bekreft ditt passord', 'auth.forgotPassword': 'Glemt passord?', 'auth.agreeToTerms': 'Jeg godtar vilkårene', 'auth.welcomeBack': 'Velkommen tilbake', 'auth.enterCredentials': 'Skriv inn dine påloggingsdata for å få tilgang til plattformen', 'auth.joinPlatform': 'Bli med i I3M-plattformen og begynn', 'auth.secureAccess': 'Sikker tilgang til din I3M-plattformkonto', 'auth.forgotPasswordTitle': 'Glemt passord?', 'auth.forgotPasswordDescription': 'Skriv inn din e-postadresse så sender vi deg en lenke for å tilbakestille passordet ditt', 'auth.sendResetLink': 'Send tilbakestillingslenke', 'auth.checkYourEmail': 'Sjekk e-posten din', 'auth.resetLinkSent': 'Vi har sendt en passordtilbakestillingslenke til', 'auth.didntReceiveEmail': 'Fikk du ikke e-posten? Sjekk søppelpostmappen din eller prøv igjen', 'auth.backToSignIn': 'Tilbake til innlogging', 'auth.tryAnotherEmail': 'Prøv en annen e-post'
  },
  da: { 
    'nav.overview': 'Overblik', 'nav.erp': 'ERP-styring', 'nav.cms': 'CMS-styring', 'nav.ecommerce': 'E-handel', 'nav.support': 'Kundesupport', 'nav.templates': 'Skabeloner', 'nav.analytics': 'Analyse', 'nav.settings': 'Indstillinger', 
    'common.loading': 'Indlæser...', 'common.save': 'Gem', 'common.edit': 'Rediger', 'common.delete': 'Slet', 
    'dashboard.welcome': 'Velkommen til I3M-platformen', 'dashboard.subtitle': 'Omfattende SaaS-styringssystem',
    'auth.signIn': 'Log ind', 'auth.signUp': 'Registrer', 'auth.email': 'E-mail', 'auth.password': 'Adgangskode', 'auth.fullName': 'Fulde navn', 'auth.confirmPassword': 'Bekræft adgangskode', 'auth.role': 'Rolle', 'auth.author': 'Forfatter', 'auth.editor': 'Redaktør', 'auth.admin': 'Administrator', 'auth.createAccount': 'Opret konto', 'auth.signingIn': 'Logger ind...', 'auth.creatingAccount': 'Opretter konto...', 'auth.failedToSignIn': 'Login mislykkedes', 'auth.failedToSignUp': 'Kontoopprettelse mislykkedes', 'auth.demoCredentials': 'Demo-loginoplysninger: admin@i3m.com / admin123', 'auth.rememberMe': 'Husk mig', 'auth.emailPlaceholder': 'Indtast din e-mailadresse', 'auth.passwordPlaceholder': 'Indtast din adgangskode', 'auth.fullNamePlaceholder': 'Indtast dit fulde navn', 'auth.confirmPasswordPlaceholder': 'Bekræft din adgangskode', 'auth.forgotPassword': 'Glemt adgangskode?', 'auth.agreeToTerms': 'Jeg accepterer vilkårene', 'auth.welcomeBack': 'Velkommen tilbage', 'auth.enterCredentials': 'Indtast dine loginoplysninger for at få adgang til platformen', 'auth.joinPlatform': 'Bliv medlem af I3M-platformen og begynd', 'auth.secureAccess': 'Sikker adgang til din I3M-platformkonto', 'auth.forgotPasswordTitle': 'Glemt adgangskode?', 'auth.forgotPasswordDescription': 'Indtast din e-mailadresse, så sender vi dig et link til at nulstille din adgangskode', 'auth.sendResetLink': 'Send nulstillingslink', 'auth.checkYourEmail': 'Tjek din e-mail', 'auth.resetLinkSent': 'Vi har sendt et adgangskode-nulstillingslink til', 'auth.didntReceiveEmail': 'Fik du ikke e-mailen? Tjek din spam-mappe eller prøv igen', 'auth.backToSignIn': 'Tilbage til login', 'auth.tryAnotherEmail': 'Prøv en anden e-mail'
  },
  fi: { 
    'nav.overview': 'Yleiskatsaus', 'nav.erp': 'ERP-hallinta', 'nav.cms': 'CMS-hallinta', 'nav.ecommerce': 'Sähkökauppa', 'nav.support': 'Asiakastuki', 'nav.templates': 'Mallit', 'nav.analytics': 'Analytiikka', 'nav.settings': 'Asetukset', 
    'common.loading': 'Ladataan...', 'common.save': 'Tallenna', 'common.edit': 'Muokkaa', 'common.delete': 'Poista', 
    'dashboard.welcome': 'Tervetuloa I3M-alustalle', 'dashboard.subtitle': 'Kattava SaaS-hallintajärjestelmä',
    'auth.signIn': 'Kirjaudu sisään', 'auth.signUp': 'Rekisteröidy', 'auth.email': 'Sähköposti', 'auth.password': 'Salasana', 'auth.fullName': 'Koko nimi', 'auth.confirmPassword': 'Vahvista salasana', 'auth.role': 'Rooli', 'auth.author': 'Tekijä', 'auth.editor': 'Toimittaja', 'auth.admin': 'Ylläpitäjä', 'auth.createAccount': 'Luo tili', 'auth.signingIn': 'Kirjaudutaan sisään...', 'auth.creatingAccount': 'Luodaan tiliä...', 'auth.failedToSignIn': 'Sisäänkirjautuminen epäonnistui', 'auth.failedToSignUp': 'Tilin luominen epäonnistui', 'auth.demoCredentials': 'Demo-kirjautumistiedot: admin@i3m.com / admin123', 'auth.rememberMe': 'Muista minut', 'auth.emailPlaceholder': 'Syötä sähköpostiosoitteesi', 'auth.passwordPlaceholder': 'Syötä salasanasi', 'auth.fullNamePlaceholder': 'Syötä koko nimesi', 'auth.confirmPasswordPlaceholder': 'Vahvista salasanasi', 'auth.forgotPassword': 'Unohtuiko salasana?', 'auth.agreeToTerms': 'Hyväksyn ehdot', 'auth.welcomeBack': 'Tervetuloa takaisin', 'auth.enterCredentials': 'Syötä kirjautumistietosi päästäksesi alustalle', 'auth.joinPlatform': 'Liity I3M-alustaan ja aloita', 'auth.secureAccess': 'Turvallinen pääsy I3M-alustatiliisi', 'auth.forgotPasswordTitle': 'Unohtuiko salasana?', 'auth.forgotPasswordDescription': 'Syötä sähköpostiosoitteesi ja lähetämme sinulle linkin salasanan nollaukseen', 'auth.sendResetLink': 'Lähetä nollauslinkki', 'auth.checkYourEmail': 'Tarkista sähköpostisi', 'auth.resetLinkSent': 'Lähetimme salasanan nollauslinkin osoitteeseen', 'auth.didntReceiveEmail': 'Etkö saanut sähköpostia? Tarkista roskapostikansio tai yritä uudelleen', 'auth.backToSignIn': 'Takaisin kirjautumiseen', 'auth.tryAnotherEmail': 'Kokeile toista sähköpostia'
  },
  pl: { 
    'nav.overview': 'Przegląd', 'nav.erp': 'Zarządzanie ERP', 'nav.cms': 'Zarządzanie CMS', 'nav.ecommerce': 'E-commerce', 'nav.support': 'Wsparcie klientów', 'nav.templates': 'Szablony', 'nav.analytics': 'Analityka', 'nav.settings': 'Ustawienia', 
    'common.loading': 'Ładowanie...', 'common.save': 'Zapisz', 'common.edit': 'Edytuj', 'common.delete': 'Usuń', 
    'dashboard.welcome': 'Witamy na platformie I3M', 'dashboard.subtitle': 'Kompleksowy system zarządzania SaaS',
    'auth.signIn': 'Zaloguj się', 'auth.signUp': 'Zarejestruj się', 'auth.email': 'E-mail', 'auth.password': 'Hasło', 'auth.fullName': 'Pełne imię', 'auth.confirmPassword': 'Potwierdź hasło', 'auth.role': 'Rola', 'auth.author': 'Autor', 'auth.editor': 'Edytor', 'auth.admin': 'Administrator', 'auth.createAccount': 'Utwórz konto', 'auth.signingIn': 'Logowanie...', 'auth.creatingAccount': 'Tworzenie konta...', 'auth.failedToSignIn': 'Logowanie nie powiodło się', 'auth.failedToSignUp': 'Tworzenie konta nie powiodło się', 'auth.demoCredentials': 'Dane demo: admin@i3m.com / admin123', 'auth.rememberMe': 'Zapamiętaj mnie', 'auth.emailPlaceholder': 'Wprowadź swój adres e-mail', 'auth.passwordPlaceholder': 'Wprowadź swoje hasło', 'auth.fullNamePlaceholder': 'Wprowadź swoje pełne imię', 'auth.confirmPasswordPlaceholder': 'Potwierdź swoje hasło', 'auth.forgotPassword': 'Zapomniałeś hasła?', 'auth.agreeToTerms': 'Zgadzam się z warunkami', 'auth.welcomeBack': 'Witamy z powrotem', 'auth.enterCredentials': 'Wprowadź swoje dane logowania, aby uzyskać dostęp do platformy', 'auth.joinPlatform': 'Dołącz do platformy I3M i zacznij', 'auth.secureAccess': 'Bezpieczny dostęp do Twojego konta platformy I3M', 'auth.forgotPasswordTitle': 'Zapomniałeś hasła?', 'auth.forgotPasswordDescription': 'Wprowadź swój adres e-mail, a wyślemy Ci link do resetowania hasła', 'auth.sendResetLink': 'Wyślij link resetujący', 'auth.checkYourEmail': 'Sprawdź swoją pocztę e-mail', 'auth.resetLinkSent': 'Wysłaliśmy link do resetowania hasła na', 'auth.didntReceiveEmail': 'Nie otrzymałeś e-maila? Sprawdź folder spam lub spróbuj ponownie', 'auth.backToSignIn': 'Powrót do logowania', 'auth.tryAnotherEmail': 'Spróbuj innego e-maila'
  },
  tr: { 
    'nav.overview': 'Genel Bakış', 'nav.erp': 'ERP Yönetimi', 'nav.cms': 'CMS Yönetimi', 'nav.ecommerce': 'E-ticaret', 'nav.support': 'Müşteri Desteği', 'nav.templates': 'Şablonlar', 'nav.analytics': 'Analitik', 'nav.settings': 'Ayarlar', 
    'common.loading': 'Yükleniyor...', 'common.save': 'Kaydet', 'common.edit': 'Düzenle', 'common.delete': 'Sil', 
    'dashboard.welcome': 'I3M Platformuna Hoş Geldiniz', 'dashboard.subtitle': 'Kapsamlı SaaS yönetim sistemi',
    'auth.signIn': 'Giriş Yap', 'auth.signUp': 'Kayıt Ol', 'auth.email': 'E-posta', 'auth.password': 'Şifre', 'auth.fullName': 'Tam Ad', 'auth.confirmPassword': 'Şifreyi Onayla', 'auth.role': 'Rol', 'auth.author': 'Yazar', 'auth.editor': 'Editör', 'auth.admin': 'Yönetici', 'auth.createAccount': 'Hesap Oluştur', 'auth.signingIn': 'Giriş yapılıyor...', 'auth.creatingAccount': 'Hesap oluşturuluyor...', 'auth.failedToSignIn': 'Giriş başarısız', 'auth.failedToSignUp': 'Hesap oluşturma başarısız', 'auth.demoCredentials': 'Demo kimlik bilgileri: admin@i3m.com / admin123', 'auth.rememberMe': 'Beni hatırla', 'auth.emailPlaceholder': 'E-posta adresinizi girin', 'auth.passwordPlaceholder': 'Şifrenizi girin', 'auth.fullNamePlaceholder': 'Tam adınızı girin', 'auth.confirmPasswordPlaceholder': 'Şifrenizi onaylayın', 'auth.forgotPassword': 'Şifrenizi mi unuttunuz?', 'auth.agreeToTerms': 'Şartları kabul ediyorum', 'auth.welcomeBack': 'Tekrar hoş geldiniz', 'auth.enterCredentials': 'Platforma erişmek için kimlik bilgilerinizi girin', 'auth.joinPlatform': 'I3M Platformuna katılın ve başlayın', 'auth.secureAccess': 'I3M Platform hesabınıza güvenli erişim', 'auth.forgotPasswordTitle': 'Şifrenizi mi unuttunuz?', 'auth.forgotPasswordDescription': 'E-posta adresinizi girin, şifrenizi sıfırlamak için size bir bağlantı gönderelim', 'auth.sendResetLink': 'Sıfırlama bağlantısı gönder', 'auth.checkYourEmail': 'E-postanızı kontrol edin', 'auth.resetLinkSent': 'Şifre sıfırlama bağlantısını şu adrese gönderdik', 'auth.didntReceiveEmail': 'E-posta almadınız mı? Spam klasörünüzü kontrol edin veya tekrar deneyin', 'auth.backToSignIn': 'Girişe dön', 'auth.tryAnotherEmail': 'Başka bir e-posta dene'
  },
  ar: { 
    'nav.overview': 'نظرة عامة', 'nav.erp': 'إدارة تخطيط موارد المؤسسة', 'nav.cms': 'إدارة نظام إدارة المحتوى', 'nav.ecommerce': 'التجارة الإلكترونية', 'nav.support': 'دعم العملاء', 'nav.templates': 'القوالب', 'nav.analytics': 'التحليلات', 'nav.settings': 'الإعدادات', 
    'common.loading': 'جاري التحميل...', 'common.save': 'حفظ', 'common.edit': 'تحرير', 'common.delete': 'حذف', 
    'dashboard.welcome': 'مرحباً بك في منصة I3M', 'dashboard.subtitle': 'نظام إدارة SaaS شامل',
    'auth.signIn': 'تسجيل الدخول', 'auth.signUp': 'إنشاء حساب', 'auth.email': 'البريد الإلكتروني', 'auth.password': 'كلمة المرور', 'auth.fullName': 'الاسم الكامل', 'auth.confirmPassword': 'تأكيد كلمة المرور', 'auth.role': 'الدور', 'auth.author': 'المؤلف', 'auth.editor': 'المحرر', 'auth.admin': 'المدير', 'auth.createAccount': 'إنشاء حساب', 'auth.signingIn': 'جاري تسجيل الدخول...', 'auth.creatingAccount': 'جاري إنشاء الحساب...', 'auth.failedToSignIn': 'فشل تسجيل الدخول', 'auth.failedToSignUp': 'فشل إنشاء الحساب', 'auth.demoCredentials': 'بيانات تجريبية: admin@i3m.com / admin123', 'auth.rememberMe': 'تذكرني', 'auth.emailPlaceholder': 'أدخل عنوان بريدك الإلكتروني', 'auth.passwordPlaceholder': 'أدخل كلمة المرور', 'auth.fullNamePlaceholder': 'أدخل اسمك الكامل', 'auth.confirmPasswordPlaceholder': 'أكد كلمة المرور', 'auth.forgotPassword': 'نسيت كلمة المرور؟', 'auth.agreeToTerms': 'أوافق على الشروط والأحكام', 'auth.welcomeBack': 'مرحباً بعودتك', 'auth.enterCredentials': 'أدخل بيانات الاعتماد للوصول إلى المنصة', 'auth.joinPlatform': 'انضم إلى منصة I3M وابدأ', 'auth.secureAccess': 'وصول آمن إلى حساب منصة I3M الخاص بك', 'auth.forgotPasswordTitle': 'نسيت كلمة المرور؟', 'auth.forgotPasswordDescription': 'أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور', 'auth.sendResetLink': 'إرسال رابط إعادة التعيين', 'auth.checkYourEmail': 'تحقق من بريدك الإلكتروني', 'auth.resetLinkSent': 'لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى', 'auth.didntReceiveEmail': 'لم تستلم البريد الإلكتروني؟ تحقق من مجلد الرسائل غير المرغوب فيها أو حاول مرة أخرى', 'auth.backToSignIn': 'العودة إلى تسجيل الدخول', 'auth.tryAnotherEmail': 'جرب بريد إلكتروني آخر'
  },
  hi: { 
    'nav.overview': 'अवलोकन', 'nav.erp': 'ERP प्रबंधन', 'nav.cms': 'CMS प्रबंधन', 'nav.ecommerce': 'ई-कॉमर्स', 'nav.support': 'ग्राहक सहायता', 'nav.templates': 'टेम्प्लेट', 'nav.analytics': 'विश्लेषण', 'nav.settings': 'सेटिंग्स', 
    'common.loading': 'लोड हो रहा है...', 'common.save': 'सेव', 'common.edit': 'संपादित करें', 'common.delete': 'हटाएं', 
    'dashboard.welcome': 'I3M प्लेटफॉर्म में आपका स्वागत है', 'dashboard.subtitle': 'व्यापक SaaS प्रबंधन प्रणाली',
    'auth.signIn': 'साइन इन', 'auth.signUp': 'साइन अप', 'auth.email': 'ईमेल', 'auth.password': 'पासवर्ड', 'auth.fullName': 'पूरा नाम', 'auth.confirmPassword': 'पासवर्ड की पुष्टि करें', 'auth.role': 'भूमिका', 'auth.author': 'लेखक', 'auth.editor': 'संपादक', 'auth.admin': 'प्रशासक', 'auth.createAccount': 'खाता बनाएं', 'auth.signingIn': 'साइन इन हो रहे हैं...', 'auth.creatingAccount': 'खाता बनाया जा रहा है...', 'auth.failedToSignIn': 'साइन इन असफल', 'auth.failedToSignUp': 'खाता बनाना असफल', 'auth.demoCredentials': 'डेमो क्रेडेंशियल: admin@i3m.com / admin123', 'auth.rememberMe': 'मुझे याद रखें', 'auth.emailPlaceholder': 'अपना ईमेल पता दर्ज करें', 'auth.passwordPlaceholder': 'अपना पासवर्ड दर्ज करें', 'auth.fullNamePlaceholder': 'अपना पूरा नाम दर्ज करें', 'auth.confirmPasswordPlaceholder': 'अपने पासवर्ड की पुष्टि करें', 'auth.forgotPassword': 'पासवर्ड भूल गए?', 'auth.agreeToTerms': 'मैं नियमों और शर्तों से सहमत हूं', 'auth.welcomeBack': 'वापस स्वागत है', 'auth.enterCredentials': 'प्लेटफॉर्म तक पहुंचने के लिए अपनी क्रेडेंशियल दर्ज करें', 'auth.joinPlatform': 'I3M प्लेटफॉर्म में शामिल हों और शुरू करें', 'auth.secureAccess': 'आपके I3M प्लेटफॉर्म खाते तक सुरक्षित पहुंच', 'auth.forgotPasswordTitle': 'पासवर्ड भूल गए?', 'auth.forgotPasswordDescription': 'अपना ईमेल पता दर्ज करें और हम आपको पासवर्ड रीसेट करने के लिए लिंक भेजेंगे', 'auth.sendResetLink': 'रीसेट लिंक भेजें', 'auth.checkYourEmail': 'अपना ईमेल जांचें', 'auth.resetLinkSent': 'हमने पासवर्ड रीसेट लिंक भेजा है', 'auth.didntReceiveEmail': 'ईमेल नहीं मिला? अपना स्पैम फोल्डर जांचें या फिर से कोशिश करें', 'auth.backToSignIn': 'साइन इन पर वापस जाएं', 'auth.tryAnotherEmail': 'दूसरा ईमेल आज़माएं'
  },
  th: { 
    'nav.overview': 'ภาพรวม', 'nav.erp': 'การจัดการ ERP', 'nav.cms': 'การจัดการ CMS', 'nav.ecommerce': 'อีคอมเมิร์ส', 'nav.support': 'การสนับสนุนลูกค้า', 'nav.templates': 'เทมเพลต', 'nav.analytics': 'การวิเคราะห์', 'nav.settings': 'การตั้งค่า', 
    'common.loading': 'กำลังโหลด...', 'common.save': 'บันทึก', 'common.edit': 'แก้ไข', 'common.delete': 'ลบ', 
    'dashboard.welcome': 'ยินดีต้อนรับสู่แพลตฟอร์ม I3M', 'dashboard.subtitle': 'ระบบจัดการ SaaS ที่ครอบคลุม',
    'auth.signIn': 'เข้าสู่ระบบ', 'auth.signUp': 'สมัครสมาชิก', 'auth.email': 'อีเมล', 'auth.password': 'รหัสผ่าน', 'auth.fullName': 'ชื่อเต็ม', 'auth.confirmPassword': 'ยืนยันรหัสผ่าน', 'auth.role': 'บทบาท', 'auth.author': 'ผู้เขียน', 'auth.editor': 'ผู้แก้ไข', 'auth.admin': 'ผู้ดูแลระบบ', 'auth.createAccount': 'สร้างบัญชี', 'auth.signingIn': 'กำลังเข้าสู่ระบบ...', 'auth.creatingAccount': 'กำลังสร้างบัญชี...', 'auth.failedToSignIn': 'เข้าสู่ระบบล้มเหลว', 'auth.failedToSignUp': 'สร้างบัญชีล้มเหลว', 'auth.demoCredentials': 'ข้อมูลทดสอบ: admin@i3m.com / admin123', 'auth.rememberMe': 'จดจำฉัน', 'auth.emailPlaceholder': 'กรอกที่อยู่อีเมลของคุณ', 'auth.passwordPlaceholder': 'กรอกรหัสผ่านของคุณ', 'auth.fullNamePlaceholder': 'กรอกชื่อเต็มของคุณ', 'auth.confirmPasswordPlaceholder': 'ยืนยันรหัสผ่านของคุณ', 'auth.forgotPassword': 'ลืมรหัสผ่าน?', 'auth.agreeToTerms': 'ฉันยอมรับข้อกำหนดและเงื่อนไข', 'auth.welcomeBack': 'ยินดีต้อนรับกลับ', 'auth.enterCredentials': 'กรอกข้อมูลเข้าสู่ระบบเพื่อเข้าถึงแพลตฟอร์ม', 'auth.joinPlatform': 'เข้าร่วมแพลตฟอร์ม I3M และเริ่มต้น', 'auth.secureAccess': 'การเข้าถึงที่ปลอดภัยไปยังบัญชีแพลตฟอร์ม I3M ของคุณ', 'auth.forgotPasswordTitle': 'ลืมรหัสผ่าน?', 'auth.forgotPasswordDescription': 'กรอกที่อยู่อีเมลของคุณและเราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ', 'auth.sendResetLink': 'ส่งลิงก์รีเซ็ต', 'auth.checkYourEmail': 'ตรวจสอบอีเมลของคุณ', 'auth.resetLinkSent': 'เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง', 'auth.didntReceiveEmail': 'ไม่ได้รับอีเมล? ตรวจสอบโฟลเดอร์สแปมหรือลองอีกครั้ง', 'auth.backToSignIn': 'กลับไปเข้าสู่ระบบ', 'auth.tryAnotherEmail': 'ลองอีเมลอื่น'
  },
  id: { 
    'nav.overview': 'Ringkasan', 'nav.erp': 'Manajemen ERP', 'nav.cms': 'Manajemen CMS', 'nav.ecommerce': 'E-commerce', 'nav.support': 'Dukungan Pelanggan', 'nav.templates': 'Template', 'nav.analytics': 'Analitik', 'nav.settings': 'Pengaturan', 
    'common.loading': 'Memuat...', 'common.save': 'Simpan', 'common.edit': 'Edit', 'common.delete': 'Hapus', 
    'dashboard.welcome': 'Selamat datang di platform I3M', 'dashboard.subtitle': 'Sistem manajemen SaaS yang komprehensif',
    'auth.signIn': 'Masuk', 'auth.signUp': 'Daftar', 'auth.email': 'Email', 'auth.password': 'Kata Sandi', 'auth.fullName': 'Nama Lengkap', 'auth.confirmPassword': 'Konfirmasi Kata Sandi', 'auth.role': 'Peran', 'auth.author': 'Penulis', 'auth.editor': 'Editor', 'auth.admin': 'Administrator', 'auth.createAccount': 'Buat Akun', 'auth.signingIn': 'Sedang masuk...', 'auth.creatingAccount': 'Membuat akun...', 'auth.failedToSignIn': 'Gagal masuk', 'auth.failedToSignUp': 'Gagal membuat akun', 'auth.demoCredentials': 'Kredensial demo: admin@i3m.com / admin123', 'auth.rememberMe': 'Ingat saya', 'auth.emailPlaceholder': 'Masukkan alamat email Anda', 'auth.passwordPlaceholder': 'Masukkan kata sandi Anda', 'auth.fullNamePlaceholder': 'Masukkan nama lengkap Anda', 'auth.confirmPasswordPlaceholder': 'Konfirmasi kata sandi Anda', 'auth.forgotPassword': 'Lupa kata sandi?', 'auth.agreeToTerms': 'Saya setuju dengan syarat dan ketentuan', 'auth.welcomeBack': 'Selamat datang kembali', 'auth.enterCredentials': 'Masukkan kredensial Anda untuk mengakses platform', 'auth.joinPlatform': 'Bergabunglah dengan platform I3M dan mulai', 'auth.secureAccess': 'Akses aman ke akun platform I3M Anda', 'auth.forgotPasswordTitle': 'Lupa kata sandi?', 'auth.forgotPasswordDescription': 'Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mereset kata sandi Anda', 'auth.sendResetLink': 'Kirim Tautan Reset', 'auth.checkYourEmail': 'Periksa email Anda', 'auth.resetLinkSent': 'Kami telah mengirimkan tautan reset kata sandi ke', 'auth.didntReceiveEmail': 'Tidak menerima email? Periksa folder spam Anda atau coba lagi', 'auth.backToSignIn': 'Kembali ke Masuk', 'auth.tryAnotherEmail': 'Coba email lain'
  },
  ms: { 
    'nav.overview': 'Gambaran Keseluruhan', 'nav.erp': 'Pengurusan ERP', 'nav.cms': 'Pengurusan CMS', 'nav.ecommerce': 'E-dagang', 'nav.support': 'Sokongan Pelanggan', 'nav.templates': 'Templat', 'nav.analytics': 'Analitik', 'nav.settings': 'Tetapan', 
    'common.loading': 'Memuatkan...', 'common.save': 'Simpan', 'common.edit': 'Edit', 'common.delete': 'Padam', 
    'dashboard.welcome': 'Selamat datang ke platform I3M', 'dashboard.subtitle': 'Sistem pengurusan SaaS yang komprehensif',
    'auth.signIn': 'Log Masuk', 'auth.signUp': 'Daftar', 'auth.email': 'E-mel', 'auth.password': 'Kata Laluan', 'auth.fullName': 'Nama Penuh', 'auth.confirmPassword': 'Sahkan Kata Laluan', 'auth.role': 'Peranan', 'auth.author': 'Pengarang', 'auth.editor': 'Editor', 'auth.admin': 'Pentadbir', 'auth.createAccount': 'Cipta Akaun', 'auth.signingIn': 'Sedang log masuk...', 'auth.creatingAccount': 'Mencipta akaun...', 'auth.failedToSignIn': 'Log masuk gagal', 'auth.failedToSignUp': 'Penciptaan akaun gagal', 'auth.demoCredentials': 'Kredensial demo: admin@i3m.com / admin123', 'auth.rememberMe': 'Ingat saya', 'auth.emailPlaceholder': 'Masukkan alamat e-mel anda', 'auth.passwordPlaceholder': 'Masukkan kata laluan anda', 'auth.fullNamePlaceholder': 'Masukkan nama penuh anda', 'auth.confirmPasswordPlaceholder': 'Sahkan kata laluan anda', 'auth.forgotPassword': 'Lupa kata laluan?', 'auth.agreeToTerms': 'Saya bersetuju dengan terma dan syarat', 'auth.welcomeBack': 'Selamat kembali', 'auth.enterCredentials': 'Masukkan kredensial anda untuk mengakses platform', 'auth.joinPlatform': 'Sertai platform I3M dan mula', 'auth.secureAccess': 'Akses selamat ke akaun platform I3M anda', 'auth.forgotPasswordTitle': 'Lupa kata laluan?', 'auth.forgotPasswordDescription': 'Masukkan alamat e-mel anda dan kami akan menghantar pautan untuk menetapkan semula kata laluan anda', 'auth.sendResetLink': 'Hantar Pautan Set Semula', 'auth.checkYourEmail': 'Semak e-mel anda', 'auth.resetLinkSent': 'Kami telah menghantar pautan set semula kata laluan ke', 'auth.didntReceiveEmail': 'Tidak menerima e-mel? Semak folder spam anda atau cuba lagi', 'auth.backToSignIn': 'Kembali ke Log Masuk', 'auth.tryAnotherEmail': 'Cuba e-mel lain'
  },
  tl: { 
    'nav.overview': 'Pangkalahatang-tanaw', 'nav.erp': 'Pamamahala ng ERP', 'nav.cms': 'Pamamahala ng CMS', 'nav.ecommerce': 'E-commerce', 'nav.support': 'Suporta sa Customer', 'nav.templates': 'Mga Template', 'nav.analytics': 'Analytics', 'nav.settings': 'Mga Setting', 
    'common.loading': 'Naglo-load...', 'common.save': 'I-save', 'common.edit': 'I-edit', 'common.delete': 'Tanggalin', 
    'dashboard.welcome': 'Maligayang pagdating sa I3M platform', 'dashboard.subtitle': 'Komprehensibong SaaS management system',
    'auth.signIn': 'Mag-login', 'auth.signUp': 'Mag-register', 'auth.email': 'Email', 'auth.password': 'Password', 'auth.fullName': 'Buong Pangalan', 'auth.confirmPassword': 'Kumpirmahin ang Password', 'auth.role': 'Tungkulin', 'auth.author': 'May-akda', 'auth.editor': 'Editor', 'auth.admin': 'Administrator', 'auth.createAccount': 'Gumawa ng Account', 'auth.signingIn': 'Nag-login...', 'auth.creatingAccount': 'Gumagawa ng account...', 'auth.failedToSignIn': 'Nabigo ang pag-login', 'auth.failedToSignUp': 'Nabigo ang paggawa ng account', 'auth.demoCredentials': 'Demo credentials: admin@i3m.com / admin123', 'auth.rememberMe': 'Tandaan ako', 'auth.emailPlaceholder': 'Ilagay ang inyong email address', 'auth.passwordPlaceholder': 'Ilagay ang inyong password', 'auth.fullNamePlaceholder': 'Ilagay ang inyong buong pangalan', 'auth.confirmPasswordPlaceholder': 'Kumpirmahin ang inyong password', 'auth.forgotPassword': 'Nakalimutan ang password?', 'auth.agreeToTerms': 'Sumasang-ayon ako sa mga tuntunin at kondisyon', 'auth.welcomeBack': 'Maligayang pagbabalik', 'auth.enterCredentials': 'Ilagay ang inyong credentials para ma-access ang platform', 'auth.joinPlatform': 'Sumali sa I3M Platform at magsimula', 'auth.secureAccess': 'Ligtas na access sa inyong I3M Platform account', 'auth.forgotPasswordTitle': 'Nakalimutan ang password?', 'auth.forgotPasswordDescription': 'Ilagay ang inyong email address at magpapadala kami ng link para i-reset ang inyong password', 'auth.sendResetLink': 'Ipadala ang Reset Link', 'auth.checkYourEmail': 'Tingnan ang inyong email', 'auth.resetLinkSent': 'Nagpadala kami ng password reset link sa', 'auth.didntReceiveEmail': 'Hindi nakatanggap ng email? Tingnan ang inyong spam folder o subukan ulit', 'auth.backToSignIn': 'Bumalik sa Login', 'auth.tryAnotherEmail': 'Subukan ang ibang email'
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
}

export function LanguageProvider({
  children,
  defaultLanguage = 'en',
  storageKey = 'language',
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    // Migrate old i3m-language key to new language key
    const oldLanguage = localStorage.getItem('i3m-language');
    if (oldLanguage && !localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, oldLanguage);
      localStorage.removeItem('i3m-language');
      console.log('🔧 Migrated i3m-language to language:', oldLanguage);
    }

    // Load saved language
    try {
      const savedLanguage = localStorage.getItem(storageKey) as Language;
      if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
        setLanguageState(savedLanguage);
        return;
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }

    // Smart language detection
    try {
      const detectedLanguage = detectSystemLanguage();
      if (detectedLanguage) {
        setLanguageState(detectedLanguage);
        // Save detected language for future use
        localStorage.setItem(storageKey, detectedLanguage);
      }
    } catch (error) {
      console.error('Error detecting system language:', error);
    }
  }, [storageKey]);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(storageKey, lang);
      setLanguageState(lang);
      console.log(`🌐 Language changed to: ${lang}`);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  // Debug function to show detection info
  const getLanguageInfo = () => {
    if (typeof window === 'undefined') return null;
    
    return {
      current: language,
      browser: navigator.language,
      allBrowser: navigator.languages,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      detected: detectSystemLanguage()
    };
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    getLanguageInfo,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
