import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import BackButton from '../_components/BackButton'

function Contact() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <BackButton />
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Sales</h1>
                    <p className="text-lg text-gray-600">
                        Have questions about our Enterprise plans? We're here to help.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    {/* Contact Info */}
                    <div className="bg-blue-600 p-8 text-white">
                        <h3 className="text-2xl font-bold mb-6">Get in touch</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500 rounded-lg">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-100">Email us</p>
                                    <p className="font-medium">sales@prepai.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500 rounded-lg">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-100">Call us</p>
                                    <p className="font-medium">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500 rounded-lg">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-100">Visit us</p>
                                    <p className="font-medium">123 AI Street, Tech Valley, CA</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h4 className="font-bold mb-4">Enterprise Benefits</h4>
                            <ul className="space-y-2 text-sm text-blue-100">
                                <li>• Custom integration support</li>
                                <li>• Dedicated account manager</li>
                                <li>• SLA guarantees</li>
                                <li>• Advanced security features</li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="p-8">
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <Input placeholder="John Doe" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                                <Input type="email" placeholder="john@company.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                                    <option>1-10 employees</option>
                                    <option>11-50 employees</option>
                                    <option>51-200 employees</option>
                                    <option>201+ employees</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <Textarea placeholder="Tell us about your needs..." className="h-32" />
                            </div>

                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
