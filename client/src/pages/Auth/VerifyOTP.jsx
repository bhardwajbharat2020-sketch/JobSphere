import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../../services';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Get email from location state or redirect to register
  const userEmail = location.state?.email;
  
  if (!userEmail) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">No email found for verification</p>
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Go to Register
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authService.verifyOTP(userEmail, data.otp);
      toast.success('✅ Email verified successfully! You can now login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResending(true);
      await authService.resendOTP(userEmail);
      toast.success('📧 New OTP sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Mail className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">
            We sent a 6-digit OTP to{' '}
            <span className="font-semibold text-blue-600">{userEmail}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP Code
            </label>
            <input
              {...register('otp', { 
                required: 'OTP is required',
                minLength: {
                  value: 6,
                  message: 'OTP must be 6 digits',
                },
                maxLength: {
                  value: 6,
                  message: 'OTP must be 6 digits',
                },
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'OTP must be a 6-digit number',
                }
              })}
              type="text"
              maxLength="6"
              className="w-full px-4 py-4 text-center text-3xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="000000"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-3 rounded-lg hover:bg-[#1D4ED8] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={resending}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
            <span>{resending ? 'Sending...' : 'Resend OTP'}</span>
          </button>
        </div>

        {/* Back to Register */}
        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Register</span>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Check your spam folder if you don't see the email. The OTP expires in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
